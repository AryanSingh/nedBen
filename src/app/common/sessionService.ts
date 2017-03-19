import { IUser } from './interfaces/user';
import { Injectable, OnInit, OnChanges, Input } from '@angular/core';

		
@Injectable()
export	class Session {
		private data:any;
		private user:IUser;
		private userFullDeatil:{};
		private loggedUserDeatil:{};

		constructor() {};

		static factory() {
				const factory = () => new Session();
				return factory;
		}

		getData(key) {
				if (angular.isUndefined(this.data[key])) {
						return undefined;
				}

				return this.data[key];
		}



		setData(key, value) {
				this.data[key] = value;
		}

		getUserData() {
				if (angular.isUndefined(this.user)) {
						return undefined;
				}
				return this.user;
		}

		getUserId() {
				if (angular.isUndefined(this.user)) {
						return 0;
				}else{
					return this.user.id;
				}						
		}

		getUserFullDeatil(){
				if (angular.isUndefined(this.userFullDeatil)) {
						return undefined;
				}

				return this.userFullDeatil;
		}
		getLoggedUserData() {
			if (angular.isUndefined(this.loggedUserDeatil)) {
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

	angular.module('nedben.commons').factory('session', Session.factory());
}
