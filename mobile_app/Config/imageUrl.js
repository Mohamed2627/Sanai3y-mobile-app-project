import { pathUrl } from "./env"

export const getImageUrl = (url) => {
    let newName = url?.slice(21);
    let newUrl = pathUrl + newName
    return newUrl
}