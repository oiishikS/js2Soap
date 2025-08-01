export interface SoapTag {
    prefix: string
    attributes?: Record<string,any>
}


export interface RequestModel extends SoapTag {

    Headers : Headers,
    Body : Body

}

export interface Headers extends SoapTag {

    session : string,
    token: Token
}

export interface Token extends SoapTag {

    timeCreated: Date,
    keepAlive: 15,
    passWord: string

}


export interface Body extends SoapTag {

    Param1 : Param[]
    Param2: Param
    Param3: number
}

export interface Param extends SoapTag {
    key : string,
    val: any
}