import { Injectable } from '@nestjs/common';
import { sign, verify, decode } from 'jsonwebtoken'
import config from '../config';



// export default class JwtService {
//     static generateTokens(payload: Object): Object {
//         // console.log("jwt:",config.jwt)
//         var accessToken = sign(payload, config.jwt.accessKey);
//         var refreshToken = sign({ "sercret": config.jwt.randomkey }, config.jwt.refreshKey)

//         return { accessToken, refreshToken }
//     }

//     static verifyToken(token: string, secretkey: string): boolean {
//         // console.log("jwt:",config.jwt)
//         let isVerified = verify(token, secretkey)
//         console.log("is verified:", isVerified)
//         return isVerified
//     }

// }


export const generateJwt = (payload: object): Object => {
    console.log("payload:", payload)
    console.log("refresh payload:", config.jwt.refresh.payload)
    var accessToken = sign(payload, config.jwt.access.key, config.jwt.access.options);
    var refreshToken = sign( config.jwt.refresh.payload, config.jwt.refresh.key, config.jwt.refresh.options)
    return { accessToken, refreshToken }
}

export const verifyJwt = (token: string, secretkey: string): object => {
    try {
        let isVerified = verify(token, secretkey)
        return isVerified
    } catch (error) {
        return error
    }


}

