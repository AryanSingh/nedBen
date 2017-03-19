
export class ILevel {
  idBadgeLevel:number;
  badgeLevelName:string;
  imgBadgeLevel:string;
  maxPointsForLevel:number;
  minPointsForLevel:number;
  pointsEarnedForLevel:number;
}

export class IBadge {
  idBadge:number;
  badgeName:string;
  pointsReached:number;
  lastUpdatePoints:any;
  levels:ILevel[];
  totalBadgePoints:number;
}

export class IUserLevel {
  idUserLevel:number;
  multipier:number;
  shortDescription:string;
  longDescription:string;
}

export class IUser {
  id:number;
  email:string;
  nickname:string;
  permissions:string[];
  creationDate: number;
  urlAvatar: string;
  badges:IBadge[];
  userLevel:IUserLevel;
}

