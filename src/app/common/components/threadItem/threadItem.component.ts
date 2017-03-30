module nedben.directives.threadItemDirective {
	'use strict';

	class ThreadItemDirective implements ng.IDirective {
		restrict = 'E';
		controller = ThreadItemDirectiveController;
		controllerAs = 'threadItem';
		bindToController = true;
		templateUrl = 'scripts/directives/thread-item/partials/thread-item.html';
		scope = {
			threadData: '=',
			threadType: '='
		};

		static factory():ng.IDirectiveFactory {
			const directive = () => new ThreadItemDirective();
			return directive;
		}
	}

	class ThreadItemDirectiveController {
		static $inject = ['ENV','AUTHURLS', 'THREAD_MANAGEMENT_URLS','ADVICE_MANAGEMENT_URLS', 'IMAGES_URLS', '$http', '$log', '$scope', '$rootScope', 'session', '$sce','timeFactory','forumFactory'];

		private ENV:any;
		private THREAD_MANAGEMENT_URLS:any;
		private IMAGES_URLS:any;
		private $http:ng.IHttpService;
		private $log:ng.ILogService;
		private $scope:ng.IScope;
		private AUTHURLS:any;
		private $rootScope:ng.IRootScopeService;
		private session:any;
		private $sce:ng.ISCEService;
		private ADVICE_MANAGEMENT_URLS:any;
		private forumFactory:any;
		private timeFactory:any;
		private threadData:any;
		private threadType:any;
		private user:any;
		private forumDeatil:any;
		private showResponseForm:boolean;
		private showSubthread:boolean;
		private commentType:any;
		private replies:any[];
		private startFrom:number=0;
		private showMore:boolean;
		private isModrate:boolean;

		constructor(ENV:any,AUTHURLS:any, THREAD_MANAGEMENT_URLS:any,ADVICE_MANAGEMENT_URLS:any, IMAGES_URLS:any, $http:ng.IHttpService, $log:ng.ILogService, $scope:ng.IScope,
			$rootScope:ng.IRootScopeService, session:any, $sce:ng.ISCEService,timeFactory:any,forumFactory:any) {
			this.ENV = ENV;
			this.THREAD_MANAGEMENT_URLS = THREAD_MANAGEMENT_URLS;
			this.ADVICE_MANAGEMENT_URLS=ADVICE_MANAGEMENT_URLS;
			this.IMAGES_URLS = IMAGES_URLS;
			this.$http = $http;
			this.$log = $log;
			this.AUTHURLS=AUTHURLS;
			this.forumFactory=forumFactory;
			this.$scope = $scope;
			this.$rootScope = $rootScope;
			this.session = session;
			this.timeFactory=timeFactory;
			this.$sce = $sce;
			this.user=this.session.getUserData();
			this.isModrate=false;
			this.commentType='NEW';
			this.showSubthread=false;
			this.showResponseForm = false;
			this.replies = [];
			// this.getReplies();
			this.$scope.$on('new-comment', (evt, type, idThread) => {
				if ( (type === 'answer') && (this.threadData.idThread === idThread) ) {
					this.toggleResponseForm();
					this.getReplies();
					this.showSubthreadFun();
				}
			});
			this.$scope.$on('abort-comment', (evt, type, idThread) => {
				if ( (type === 'answer') && (this.threadData.idThread === idThread) ) {
					this.toggleResponseForm();
				}
			});
			if(this.threadType!=='OFFER'){
				let isModrate=false;
					this.forumDeatil=this.forumFactory.getForumDetail();
					angular.forEach(this.user['permissions'].forumRules,function(val,key){
								if(val==='edit' || val==='*'){
									isModrate=true;
								}
					});
					if(isModrate){
					this.isModrate=isModrate;
				}
			}else{
				let isModrate=false;
				angular.forEach(this.user['permissions'].offerRules,function(val,key){
					if(val==='edit' || val==='*'){
									isModrate=true;
								}
					});
				if(isModrate){
					this.isModrate=isModrate;
				}
			}
		}

		getReplies() {
			let userId = this.session.getUserData() ? this.session.getUserData().id : 0;
			if(this.threadType==='OFFER'){
				this.$http.post(this.ENV.apiBasePath + this.THREAD_MANAGEMENT_URLS.REPLIES,
					{ 
					idUserLogged:userId,
					idThreadFather:this.threadData.idThread,
					startFrom:this.startFrom,
					numRows:3}
					,{headers:{'Content-Type': 'application/json'}})
				.success(
					(data:any, status) => {
						if(Object.keys(data).length > 0){
																		for (var i = 0; i < Object.keys(data).length; i++) {
																			this.replies.push(data[i]);
																			this.startFrom++;				
																}
																this.changeTimeFormat();
															}
					}
					)
				.error(
					(error) => {
						this.$log.debug('getReplies', error);
					}
					);
			} else {
				this.$http.post(this.ENV.apiBasePath + this.THREAD_MANAGEMENT_URLS.FORUM_REPLIES,{
					idUserLogged:userId,
					idThreadFather:this.threadData.idThread,
					startFrom:this.startFrom,
					numRows:3
				},{headers:{'Content-Type': 'application/json'}})
				.success(
					(data:any, status) => {
						if(Object.keys(data).length > 0){
																		for (var i = 0; i < Object.keys(data).length; i++) {
																			this.replies.push(data[i]);
																			this.startFrom++;					
																}
																this.changeTimeFormat();
															}
					}
					)
				.error(
					(error) => {
						this.$log.debug('getReplies', error);
					}
					);

			}
			
		}

		changeTimeFormat(){
			for(var i=0;i < this.replies.length; i++){
				this.replies[i].date=this.timeFactory.getTimeSince(this.replies[i].date);
			}
		}

		toggleResponseForm() {
			if(this.session.getUserData()){
				this.showResponseForm = !this.showResponseForm;
			}else{
				this.$rootScope.$broadcast('Auth-openModal');
			}
			
		}

		likeThread(threadObject) {
			let urlPath=this.threadType==='OFFER' ? this.THREAD_MANAGEMENT_URLS.LIKE_THREAD : this.THREAD_MANAGEMENT_URLS.FORUM_LIKE_THREAD;
			if(this.session.getUserData()){
				let likeStatus=0;
				if(threadObject.likeLogged===0){
					likeStatus=1;
				}
				this.$http.put(this.ENV.apiBasePath + urlPath,
				{
					idThread:threadObject.idThread,
					idUser:this.session.getUserData().id,
					like:likeStatus
				}
				,{}).success((data,status)=>{
					toastr.success('Azione salvare con successo ..!');
					threadObject.likeLogged=likeStatus;
					if(likeStatus > 0){
						threadObject.totLikes=threadObject.totLikes+1;
					}else{
						threadObject.totLikes=threadObject.totLikes-1;
					}
				})
				.error((err)=>{
					console.log(err);
				});

			}else{
				this.$rootScope.$broadcast('Auth-openModal');
			}  
		}
		reportThread(obj){
			window.localStorage.setItem("reportObj", JSON.stringify(obj));
			window.localStorage.setItem("reportType", 'THREAD');

		}

		showSubthreadFun(){
			if(this.showSubthread){
				this.showSubthread=false;
			}else{
				this.showSubthread=true;
			}
		}

		bestMarked(threadObject){
			if(this.threadType!=='OFFER'){
				this.$http.put(this.ENV.apiBasePath + this.ADVICE_MANAGEMENT_URLS.MARK_BEST,
					{idForum:threadObject.idTarget,idThreadBest:threadObject.idThread},
					{headers:{'Content-Type': 'application/json'}})
				.success((data:any, status) => {
					toastr.success('posta segnato migliore successo');
					this.forumDeatil['idThreadBest']=threadObject.idThread;
				})
				.error((error) => {
					this.$log.debug('getReplies', error);
				});
			}
		}

		trust(src) {
			return this.$sce.trustAsResourceUrl(src);
		}


		updateCommnt(cmntTxt){
				this.$rootScope.$broadcast('update-comnt',cmntTxt);
		}


	}

	angular.module('nedben.directives').directive('threadItem', ThreadItemDirective.factory());
}
