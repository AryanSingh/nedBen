import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class ApiService {

	// private headers = new Headers({ 'Content-Type': 'application/json'});
	// private apiUrl = 'http://grexter.in/api/properties/29';

	constructor(
		private http: Http
	) {};

	public getData( apiUrl: any, postBody: any, callback: any): void {

		if (postBody) {
			this.http.post(apiUrl, postBody)
					 .map(res => res.json())
					 .subscribe(
					    data => callback(data),
					    err => this.handleError(err),
					    () => console.log('api call completed')
					  );
			console.log("we are reaching apiService");
					 
		} else {
			this.http.get(apiUrl)
					 .map(res => res.json())
					 .subscribe(
					    data => callback(data),
					    err => this.handleError(err),
					    () => console.log('api call completed')
					  );
			console.log("we are reaching apiService without any parameters in the http call");
		}
	}

	private handleError(error: any): Promise<any> {
		console.error('An error occoured', error);
		return Promise.reject(error.message || error);
	}
}
