import { IUser } from './interfaces/user';
import { Injectable, OnInit, OnChanges, Input } from '@angular/core';
import isUndefined from 'lodash/isUndefined';


		
@Injectable()
export	class SessionService {
	private data:any;
	private user:IUser;
	private userFullDeatil:{};
	private loggedUserDeatil:{};

	constructor() {};


	getData(key) {
		if (isUndefined(this.data[key])) {
			return undefined;
		}

		return this.data[key];
	}



	setData(key, value) {
		this.data[key] = value;
	}

	getUserData() {
		if (isUndefined(this.user)) {
				return undefined;
		}
		return this.user;
	}

	getUserId() {
		if (isUndefined(this.user)) {
			return 0;
		}else{
			return this.user.id;
		}						
	}

	getUserFullDeatil(){
		if (isUndefined(this.userFullDeatil)) {
			return undefined;
		}

		return this.userFullDeatil;
	}

	getLoggedUserData() {
		if (isUndefined(this.loggedUserDeatil)) {
			return undefined;
		}
		return this.loggedUserDeatil;

	}



	setUserData(data) {
		this.user = data;
	}

	setUserFullDeatil(value){
		this.userFullDeatil=value;
	}

	setLoggedUserData(data) {
		this.loggedUserDeatil = data;
	}




}

