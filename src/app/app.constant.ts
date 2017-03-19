export const AUTHURLS = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  UPDATE_AVTAR:'refresh-user',
  GETLOGGEDUSER: 'get-logged-user',
  REGISTRATION: 'user-management/register',
  USER_DETAIL:'user-management/get-user-details',
  REGISTRATION_SOCIAL: 'register-social',
  CONFIRM_REGISTRATION: 'user-management/confirm-registration',
  RECOVERY: 'user-management/reset-user-psw',
  RESETPWD: 'user-management/confirm-reset-user-psw'
}

export const GENERICS = {
  GET_CATEGORY_LIST: 'generics-management/getCategoryList',
  GET_FORUM_CATEGORY_LIST: 'generics-management/getForumCategoryList',
  GET_REPORT_TYPE_THREAD:"generics-management/getReportThreadTypeList",
  GET_REPORT_TYPE_USER:"generics-management/getReportUserTypeList",
  GET_CATEGORY_INSLIST:'generics-management/getCategoryListIns',
  GET_FORUM_CATEGORY_INSLIST: 'generics-management/getForumCategoryListIns',
  GET_REPORT_TYPE_OFFER:"generics-management/getReportOfferTypeList",
  GET_REPORT_TYPE_FORUM:"generics-management/getReportForumTypeList",
  GET_SORT_TYPE:'generics-management/getSortingTypeList',
  GET_CIVIL_TYPE:'generics-management/getCivilStatesList'
}

export const OFFER_MANAGEMENT_URLS = {
  INSERT: 'offer-management/offer/insert',
  UPDATE:'offer-management/offer/update',
  GET_DETAIL: 'offer-management/offer/',
  OFFER_DETAIL: 'offer-management/offer-detail',
  SAVE_OFFER: 'offer-management/offer/save',
  REMOVE_SAVE_OFFER:"offer-management/offer/remove-for-user",
  GET_REMOTE: 'offer-management/offer/get-remote',
  RATE: 'offer-management/offer/rate',
  LAST_OFFERS_POSTED: 'offer-management/offer/offersPosted',
  BEST_OFFERS: 'offer-management/offer/bestOffers',
  UPLOAD_IMAGE:'upload-management/uploadOfferImage',
  EXPIRED_OFFER:'offer-management/offer/report-offer-expired',
  EXPIRED_CONFIRM_OFFER:'offer-management/offer/confirm-orNot-offer-expired',
  DEACIVE_NOTIFY:'offer-management/offer/updateOfferUserNotify'
}

export const ADVICE_MANAGEMENT_URLS = {
  INSERT: 'forum-management/forum/insert',
  GET_DETAIL: 'forum-management/forum',
  UPDATE_FORUM: 'forum-management/forum/update',
  LAST_FORUMS_POSTED: 'forum-management/forum/lastForumsPosted',
  SAVE_FORUM:'forum-management/forum/save',
  REMOVE_SAVE_FORUM:'forum-management/forum/remove-for-user',
  MARK_BEST:'forum-management/forum/mark-response-best',
  DEACIVE_NOTIFY:'forum-management/forum/updateForumUserNotify'
}

export const THREAD_MANAGEMENT_URLS = {
  INSERT: 'thread-management/thread/insert',
  UPDATE: 'thread-management/thread/update',
  DELETE: 'thread-management/thread/update',
  GET_DETAIL: 'thread-management/getPagedThreads',
  REPLIES: 'thread-management/getPagedThreadReplies',
  LIKE_THREAD:'thread-management/likeThread',

  FORUM_INSERT: 'forum-thread-management/thread/insert',
  FORUM_UPDATE: 'forum-thread-management/thread/update',     
  FORUM_GET_DETAIL: 'forum-thread-management/getPagedThreads',
  FORUM_REPLIES: 'forum-thread-management/getPagedThreadReplies',
  FORUM_LIKE_THREAD:'forum-thread-management/likeThread'
}

export const NOTICE_MANAGEMENT = {
  GET_NOTICE:'notice-management/get-user-notices',
  SET_NOTICE_READ:'notice-management/set-notice-as-read',
  GET_COUNT_NOTICE:'notice-management/get-all-unread-notices',
  NOTICE_AS_READ:'notice-management/set-notice-as-read'
}

export const IMAGES_URLS = {
  DOMAIN: 'http://static.nedben.com',
  BADGES: '/img/assets/badges/png/',
  IMAGES: '/img/assets/'
}

export const SEARCH_URLS = {
  OFFER: 'search/offer',
  SERACH_FRIEND:'user-management/search-friends',
  FORUM:'search/forum'
}

export const USER_MANAGEMENT = {
  LIKE_USER_URL: 'user-management/like-user',
  FOLLOW_USER_URL:'user-management/follow-user',
  IGNORE_USER_URL:'user-management/ignore-user',
  REMOVE_LIKE_USER_URL:'user-management/remove-like-user',
  REMOVE_FOLLOW_USER_URL:'user-management/remove-follow-user',
  REMOVE_IGNORE_USER_URL:'user-management/remove-ignore-user',
  UPLOAD_AVATAR:'upload-management/uploadAvatar',
  UPDATE_USER:'user-management/update-user-profile',
  REMOVE_AVATAR:'upload-management/removeAvatar',
  GET_AVATAR:'user-management/get-user-avatars'       
}

export const REPORT_ABUSE_URLS = {
  REPORT_THREAD:'thread-management/offer/reportThreadAbuse',
  REPORT_USER:'user-management/report-user-abuse',
  REPORT_OFFER:'offer-management/offer/create-offer-report',
  REPORT_FORUM:'forum-management/forum/create-forum-report'
}

export const SETTING_MANAGEMENT_URLS = {
  GET_USER_DATA:'setting-management/get-user-data',
  UPDATE_USER_DATA:'setting-management/update-user-data',
  CHANGE_PASSWORD:'setting-management/change-password',
  CHANGE_NICK:'setting-management/change-nick',
  CHANGE_MAIL:'setting-management/change-email',
  GET_USER_CATEGORY:'setting-management/get-user-category',
  GET_POST_SHOW:'setting-management/get-post-to-show',
  UPDATE_USER_CATEGORY:'setting-management/update-user-category',
  UPDATE_POST_SHOW:'setting-management/update-post-to-show',
  GET_PRIVACY_OPTIONS:'setting-management/get-user-setting-options',
  UPDATE_PRIVACY_OPTION:'setting-management/update-user-setting-option',
  GET_USER_PERSONALINFO:'setting-management/get-user-personal-info',
  UPDATE_USER_PERSONALINFO:'setting-management/update-user-personal-info'
}

export const MESSAGE_MANAGEMENT = {
  GET_DETAIL: 'message-management/getMessagesRecord',
  INSERT:'message-management/insertMessage',
  GET_MESSAGES:'message-management/getUserMessages',
  SET_READ_MESSAGE:'message-management/setMessageAsRead'
}

export const BADGE_MANAGEMENT = {
  GET_DETAIL: 'badge-management/get-badge-list',
  GET_BADGE_DETAIL:'badge-management/get-badge-detail'
}

export const CONTACT_MANAGEMENT = {
  SEND: 'contact-management/contact/insert'
}



