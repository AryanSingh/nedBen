import { IUser }  from './user';

export class ICategory {
  idCategory:number;
  descCategory:string;
}

export class IOffer {
  id:number;
  name:string;
  description:string;
  price:number;
  url:string;
  tags:any[];
  user:IUser;
  dateIns:Date;
  category:ICategory;
  imgUrl:string;
  startDate:Date;
  endDate:Date;
}


