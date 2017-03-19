
export class ForumFactory {
	private forumData:any;
	private threadCount:number;
	static factory() {
	  const factory = () => new ForumFactory();
	  return factory;
	}

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

  

  
