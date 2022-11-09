type element="火"|"氷"|"風"|"土"|"雷"|"水"|"光"|"闇"|"無"//属性
type moveType="物理"|"息"|"魔法"//種別
type ability={
    name:string|null,
    effect:string|null
}
type move={
    number:number|null,
    name:string|null,
    successRate:number|null,
    type:number|null,
    element:element|null,
    damage:string|null,
    attackNumber:number|null,
    reach:number|null,
    range:string|null,
    effects:string[]
}
type enemy={
    tag:string|null,
    name:string|null,
    level:number|null,
    element:element|null,
    HP:number|null,
    armor:number|null,
    dodge:number|null,
    initiative:number|null,
    actionPoint:number|null,
    actionNumber:number|null,
    statusEffects:{
        flame:boolean|null,
        ice:boolean|null,
        dazzle:boolean|null,
        sleep:boolean|null,
        confusion:boolean|null,
        stun:boolean|null,
        curse:boolean|null,
        atkDown:boolean|null,
        defDown:{
            physical:boolean|null,
            breath:boolean|null,
            magic:boolean|null
        },
        spdDown:boolean|null
        },
    stealth:boolean|null,
    abilities:ability[],
    moves:move[],
    note:string|null
}

export type typeJSON={
    data:enemy[]
}