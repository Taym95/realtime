import { observable, computed, action } from 'mobx';
import page from 'page';
import Uri from 'urijs';
import { User } from './User';
import Socket from '../Socket';
import { api } from './Base';

export default class ViewStore {
    socket = null;
    @observable online = false;
    @observable currentUser = new User();
    @observable.ref currentView = null;
    @observable notifications = [];

    @computed get isAuthenticated() {
        return !!this.currentUser.id;
    }

    constructor() {
        this.socket = new Socket();
        this.socket.on('open', this.handleSocketOpen);
        this.socket.on('close', this.handleSocketClose);
        this.socket.on('message', this.handleSocketMessage);
        api.socket = this.socket;
    }

    initialize() {
        const url = new Uri(window.location.href);
        const urlParams = url.search(true);
        if (urlParams.code) {
            this.performAuthentication(urlParams.code);
            page('/');
        } else {
            this.tryLogin();
        }
    }

    setView(view) {
        // We set `currentView` to null temporary on purpose, to let the `currentView` unmount.
        this.currentView = null;
        this.currentView = view;
    }

    handleSocketOpen = () => {
        this.online = true;
        console.log('Connection established.');
    };

    handleSocketClose = () => {
        this.online = false;
        console.log('Connection closed.');
    };

    handleSocketMessage = ({ type, data, ...meta }) => {
        if (meta.code === 'unauthorized') {
            this.currentUser.logout();
            return;
        }
        if (type === 'authenticate') {
            if (data === null) {
                this.currentUser.logout();
            } else {
                this.currentUser.setToken(meta.authorization);
                this.tryLogin();
            }
        }
        if (type === 'bootstrap') {
            this.currentUser.parse(data);
        }
    };

    performAuthentication(code) {
        this.socket.send({ type: 'authenticate', data: { code } });
    }

    performLogout() {
        this.socket.authToken = null;
        this.currentUser.logout();
    }

    tryLogin() {
        const token = this.currentUser.getToken();
        if (token) {
            this.socket.authToken = token;
            this.socket.send({ type: 'bootstrap' });
        }
    }
}
