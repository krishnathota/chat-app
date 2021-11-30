const app = require('express')();
const http = require('http').Server(app);
const crypto = require('crypto');
const io = require('socket.io')(http);
const jwt = require('jwt-decode');
const PORT = process.env.PORT || 3001;

const randomId = () => crypto.randomBytes(8).toString('hex');

const {InMemorySessionStore} = require('./sessionStore');
const sessionStore = new InMemorySessionStore();

const {InMemoryMessageStore} = require('./messageStore');
const messageStore = new InMemoryMessageStore();

io.use((socket, next) => {
    const sessionId = socket.handshake.auth.sessionId;
    if (sessionId) {
        const session = sessionStore.findSession(sessionId);
        if (session) {
            socket.sessionId = sessionId;
            socket.userId = session.userId;
            socket.userName = session.userName;
            return next();
        }
    }
    if (!socket.handshake.auth.token) {
        return next(new Error('Token unavailable'));
    }
    const decoded = jwt(socket.handshake.auth.token);

    //TODO: Delete this
    decoded.user_name = [
        'comxclient',
        'bm_operator_1',
        'mesadmin',
        'bm_admin_1',
        'bm_lineleader_1',
    ][Math.floor(Math.random() * 5)];

    const userName = decoded.user_name;
    if (!userName) {
        return next(new Error('Invalid token'));
    }
    var userId = sessionStore.findUserIdInAllSessions(userName);

    socket.sessionId = randomId();
    socket.userId = userId || randomId();
    socket.userName = userName;
    next();
});

const messagesPerUser = new Map();

io.on('connection', (socket) => {
    // persist session
    sessionStore.saveSession(socket.sessionId, {
        userId: socket.userId,
        userName: socket.userName,
        status: 1,
    });

    // emit session details
    socket.emit('session', {
        sessionId: socket.sessionId,
        userId: socket.userId,
    });

    // join the "userId" room
    socket.join(socket.userId);

    // fetch existing users
    const users = [];

    messageStore.findMessagesForUser(socket.userId).forEach((message) => {
        const {from, to} = message;
        const otherUser = socket.userId === from ? to : from;
        if (messagesPerUser.has(otherUser)) {
            const otherMessages = messagesPerUser.get(otherUser);
            if (otherMessages.every((_) => _.messageId !== message.messageId))
                otherMessages.push(message);
        } else {
            messagesPerUser.set(otherUser, [message]);
        }
    });
    sessionStore.findAllSessions().forEach((session) => {
        users.push({
            userId: session.userId,
            userName: session.userName,
            status: session.status,
            messages: messagesPerUser.get(session.userId) || [],
        });
    });

    // Filter users that are present at-least once or online if multiple sessions exists.
    const _uniqueUsers = [];
    users.forEach((user) => {
        const _existing = _uniqueUsers.find((_) => user.userId === _.userId);
        if (!_existing) {
            _uniqueUsers.push(user);
        } else if (user.status === 1) {
            _existing.status = 1;
        }
    });

    socket.emit('users', _uniqueUsers);

    // notify existing users
    socket.broadcast.emit('user connected', {
        userId: socket.userId,
        userName: socket.userName,
        status: 1,
        messages: messagesPerUser.get(socket.userId) || [],
    });

    // forward the private message to the right recipient (and to other tabs of the sender)
    socket.on('private message', ({content, to}) => {
        const message = {
            content,
            timestamp: new Date(),
            from: socket.userId,
            to,
        };
        socket.to(to).to(socket.userId).emit('private message', message);
        messageStore.saveMessage({...message, messageId: randomId()});
    });

    // notify users upon disconnection
    socket.on('disconnect', async () => {
        const matchingSockets = await io.in(socket.userId).allSockets();
        const isDisconnected = matchingSockets.size === 0;
        if (isDisconnected) {
            // notify other users
            socket.broadcast.emit('user disconnected', socket.userId);
            // update the connection status of the session
            sessionStore.saveSession(socket.sessionId, {
                userId: socket.userId,
                userName: socket.userName,
                status: 0,
            });
        }
    });
});

app.get('/', (req, res) => {
    res.json({Working});
});

http.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}/`),
);
