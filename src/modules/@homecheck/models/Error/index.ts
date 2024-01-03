export const ErrorCode = {

}

export const ErrorMessage = (code: string | number) => {
    const _ErrorCode = `${code}`
    return ErrorCode[_ErrorCode] ? ErrorCode[_ErrorCode] : '알 수 없는 오류'
}