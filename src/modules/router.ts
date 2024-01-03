import {createRouter, createWebHistory, useRoute} from 'vue-router/auto'
import {authAxios} from "@/modules/@homecheck/libs/WebRequests";
import {LocalDocument} from "@/modules/@homecheck/libs/LocalDocument"

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL)
})

// middleWare
router.beforeEach(async (to, from) => {
    let auth = await authAxios.getContentsTokens()
    if (!auth && to.path != '/login') {
        //console.log('redirect to Login')
        return navigateTo('/login');
    }
    // 페이지 권한 가져오기
    let _permission = await LocalDocument.get('permission')
    // 만약 정상적으로 가져왔다면
    if (_permission && typeof _permission == "object" && to.path != "/login") {
        const Permission = [];
        // 모든 항목들을 나열
        _permission.map((_item) => {
            _item.group.map((__item) => {
                Permission.push(__item.to);
            });
        });
        // 가려는 목적지와 권한이 일치하는지 확인
        const permissionPolicy = Permission.filter((_permission) => {
            if (_permission.split("/").length == 2) {
                return _permission.includes(to.path);
            } else {
                return to.path.startsWith(_permission) && to.path.includes(_permission);
            }
        }).length == 0;

        if (permissionPolicy && to.path != "/") {

            return navigateTo("/");
        }
    }

    return
})
export const useRoutes = useRoute


export const navigateTo = (path: string) => {
    router.push(path)
}

export const routerToClass = (path: string) => {
    return path.split("/").join(" ")
}

export default (vueApp) => {
    vueApp.use(router)
}