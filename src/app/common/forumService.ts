
export class ForumService {
	private forumData:any;
	private threadCount:number;
	constructor() {};

	getForumDetail(){
	  if(this.forumData){
	    return this.forumData;
	  }else{
	    return undefined;
	  }
	}

	setForumDetail(data){
	  this.forumData=data;
	}
}

  

  
