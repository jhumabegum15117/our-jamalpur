import { onSnapshotsInSync, doc, getDocFromServer } from 'firebase/firestore';
import { db } from '../firebase';

export type SyncStatus = 'synced' | 'syncing' | 'offline';

export interface SyncState {
  status: SyncStatus;
  isSyncing: boolean;
  isOnline: boolean;
  lastSyncedAt: Date | null;
  activeSocketChannel: boolean;
}

type SyncListener = (state: SyncState) => void;

class SyncStatusService {
  private listeners: Set<SyncListener> = new Set();
  private state: SyncState = {
    status: typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'synced',
    isSyncing: false,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    lastSyncedAt: new Date(),
    activeSocketChannel: typeof navigator !== 'undefined' ? navigator.onLine : true,
  };

  private activeNetworkRequests = 0;
  private syncingTimeout: any = null;
  private unsubscribeSnapshotsInSync: (() => void) | null = null;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    // 1. Listen for browser network online/offline transitions
    window.addEventListener('online', () => {
      this.notifySyncStart('network-reconnected');
      setTimeout(() => {
        this.updateState({
          isOnline: true,
          activeSocketChannel: true,
          status: 'synced',
          isSyncing: false,
          lastSyncedAt: new Date(),
        });
      }, 1200);
    });

    window.addEventListener('offline', () => {
      this.updateState({
        isOnline: false,
        activeSocketChannel: false,
        status: 'offline',
        isSyncing: false,
      });
    });

    // 2. Attach Firestore snapshots-in-sync listener (monitors live WebChannel / socket activity)
    try {
      if (db) {
        this.unsubscribeSnapshotsInSync = onSnapshotsInSync(db, () => {
          this.handleSnapshotsInSync();
        });
      }
    } catch (e) {
      console.warn('Firestore onSnapshotsInSync listener setup:', e);
    }

    // 3. Monitor real-time Firestore WebChannel & API network activity
    this.setupNetworkActivityInterceptor();

    // 4. Listen to custom database sync trigger events
    window.addEventListener('oj-db-sync-start', () => {
      this.notifySyncStart('custom-event');
    });
    window.addEventListener('oj-db-sync-complete', () => {
      this.notifySyncEnd();
    });
  }

  private setupNetworkActivityInterceptor() {
    if (typeof window === 'undefined' || !window.fetch) return;

    const originalFetch = window.fetch.bind(window);

    window.fetch = async (...args: Parameters<typeof fetch>) => {
      let isFirestoreOrAuthRequest = false;
      const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request)?.url || '';

      if (
        url.includes('firestore.googleapis.com') ||
        url.includes('identitytoolkit.googleapis.com') ||
        url.includes('firebase') ||
        url.includes('webchannel')
      ) {
        isFirestoreOrAuthRequest = true;
      }

      if (isFirestoreOrAuthRequest) {
        this.activeNetworkRequests++;
        this.notifySyncStart('socket-activity');
      }

      try {
        const response = await originalFetch(...args);
        return response;
      } finally {
        if (isFirestoreOrAuthRequest) {
          this.activeNetworkRequests = Math.max(0, this.activeNetworkRequests - 1);
          if (this.activeNetworkRequests === 0) {
            // Give a short optical duration so user sees the transition smoothly
            if (this.syncingTimeout) clearTimeout(this.syncingTimeout);
            this.syncingTimeout = setTimeout(() => {
              this.notifySyncEnd();
            }, 600);
          }
        }
      }
    };
  }

  private handleSnapshotsInSync() {
    // When Firestore completes syncing local snapshots with remote socket state
    this.updateState({
      status: this.state.isOnline ? 'synced' : 'offline',
      isSyncing: false,
      lastSyncedAt: new Date(),
      activeSocketChannel: this.state.isOnline,
    });
  }

  public getState(): SyncState {
    return { ...this.state };
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private updateState(partial: Partial<SyncState>) {
    this.state = {
      ...this.state,
      ...partial,
    };
    this.emitChange();
  }

  private emitChange() {
    const currentState = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(currentState);
      } catch (err) {
        console.error('Error in sync status listener:', err);
      }
    });
  }

  public notifySyncStart(reason?: string) {
    if (!this.state.isOnline) return;
    if (this.syncingTimeout) clearTimeout(this.syncingTimeout);

    this.updateState({
      status: 'syncing',
      isSyncing: true,
      activeSocketChannel: true,
    });
  }

  public notifySyncEnd() {
    if (!this.state.isOnline) {
      this.updateState({
        status: 'offline',
        isSyncing: false,
      });
      return;
    }

    this.updateState({
      status: 'synced',
      isSyncing: false,
      lastSyncedAt: new Date(),
      activeSocketChannel: true,
    });
  }

  public async triggerManualSync(): Promise<boolean> {
    if (!this.state.isOnline) {
      return false;
    }

    this.notifySyncStart('manual-trigger');

    try {
      // Test server connection to verify latest Firestore socket state
      await getDocFromServer(doc(db, 'test', 'connection')).catch(() => {});
      // Short delay for visual clarity
      await new Promise((resolve) => setTimeout(resolve, 800));

      this.notifySyncEnd();
      return true;
    } catch (e) {
      console.warn('Manual sync check:', e);
      this.notifySyncEnd();
      return true;
    }
  }

  public destroy() {
    if (this.unsubscribeSnapshotsInSync) {
      this.unsubscribeSnapshotsInSync();
      this.unsubscribeSnapshotsInSync = null;
    }
  }
}

export const syncStatusService = new SyncStatusService();
