class SessionStore {
    findSession(id) {}
    saveSession(id, session) {}
    findAllSessions() {}
}

class InMemorySessionStore extends SessionStore {
    constructor() {
        super();
        this.sessions = new Map();
    }

    findSession(id) {
        return this.sessions.get(id);
    }

    saveSession(id, session) {
        this.sessions.set(id, session);
    }

    findAllSessions() {
        return [...this.sessions.values()];
    }

    findUserIdInAllSessions(userName) {
        const _session = this.findAllSessions().find(
            (session) => session.userName === userName,
        );
        if (_session) {
            return _session.userId;
        }
    }
}

module.exports = {
    InMemorySessionStore,
};
