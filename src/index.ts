import Module from "module";
import * as fs from 'fs'
import {typeJSON} from "./index.d"

const jsonUrl:string="./data.json"
const json = fs.readFileSync(jsonUrl)
const data = JSON.parse(json)

window.alert(data)