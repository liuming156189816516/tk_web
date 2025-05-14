import request from '@/utils/request'
export const getaccountinfolist = (params) =>{
    return request({url:'/account/getaccountinfolist',method:'post',data:params})
}
export const getaccountfilelist = (params) =>{
    return request({url:'/account/getaccountfilelist',method:'post',data:params})
}
export const getaccountgrouplist = (params) =>{
    return request({url:'/account/getaccountgrouplist',method:'post',data:params})
}
export const doaccountgroup = (params) =>{
    return request({url:'/account/doaccountgroup',method:'post',data:params})
}
export const checkaccountfile = (params) =>{
    return request({url:'/account/checkaccountfile',method:'post',data:params})
}
export const addaccount = (params) =>{
    return request({url:'/account/addaccount',method:'post',data:params})
}
export const getaccountschedule = (params) =>{
    return request({url:'/account/getaccountschedule',method:'post',data:params})
}
export const getaccountloglist = (params) =>{
    return request({url:'/account/getaccountloglist',method:'post',data:params})
}
export const dooutputaccountlog = (params) =>{
    return request({url:'/account/dooutputaccountlog',method:'post',data:params})
}
export const getwaport = (params) =>{
    return request({url:'/account/getwaport',method:'post',data:params})
}
export const dobathdelaccountfile = (params) =>{
    return request({url:'/account/dobathdelaccountfile',method:'post',data:params})
}

export const doupgroup = (params) =>{
    return request({url:'/account/doupgroup',method:'post',data:params})
}
export const dofreedip = (params) =>{
    return request({url:'/account/dofreedip',method:'post',data:params})
}
export const dousestatus = (params) =>{
    return request({url:'/account/dousestatus',method:'post',data:params})
}
export const dooutputaccount = (params) =>{
    return request({url:'/account/dooutputaccount',method:'post',data:params})
}
export const dobatchdelaccount = (params) =>{
    return request({url:'/account/dobatchdelaccount',method:'post',data:params})
}
export const doupremark = (params) =>{
    return request({url:'/account/doupremark',method:'post',data:params})
}

export const getdynamicip = (params) =>{
    return request({url:'/ip/getdynamicip',method:'post',data:params})
}

export const getstaticip = (params) =>{
    return request({url:'/ip/getstaticip',method:'post',data:params})
}

export const dobatchlogin = (params) =>{
    return request({url:'/account/dobatchlogin',method:'post',data:params})
}

export const dobatchfastlogin = (params) =>{
    return request({url:'/account/dobatchfastlogin',method:'post',data:params})
}
export const dobatchlogout = (params) =>{
    return request({url:'/account/dobatchlogout',method:'post',data:params})
}
export const doresetip = (params) =>{
    return request({url:'/ip/doresetip',method:'post',data:params})
}
export const distributecustomer = (params) =>{
    return request({url:'/account/distributecustomer',method:'post',data:params})
}
export const doaccountinfo = (params) =>{
    return request({url:'/account/doaccountinfo',method:'post',data:params})
}
export const getaccountupinfologlist= (params) =>{
    return request({url:'/account/getaccountupinfologlist',method:'post',data:params})
}
export const getinheritgrouplist= (params) =>{
    return request({url:'/account/getinheritgrouplist',method:'post',data:params})
}
export const getinheritaccountlist= (params) =>{
    return request({url:'/account/getinheritaccountlist',method:'post',data:params})
}
export const doinherit= (params) =>{
    return request({url:'/account/doinherit',method:'post',data:params})
}
export const sortgroup = (params) =>{
    return request({url:'/account/sortgroup',method:'post',data:params})
}






