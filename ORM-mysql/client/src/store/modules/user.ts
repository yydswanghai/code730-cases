import { defineStore } from 'pinia'
import { login as apiLogin, loginOut as apiLoginOut, whoAmI as apiWhoAmI } from '@/api/user'

export const useUserStore = defineStore({
    id: 'app-user',
    state: () => ({
        data: null,
        isLoading: false,
    }),
    actions: {
        async login({ loginId, loginPwd }: { loginId: string, loginPwd: string }){
            this.isLoading = true;
            const resp = await apiLogin({ loginId, loginPwd });
            this.isLoading = false;
            if(resp.code === 0){
                this.data = resp.data;
                return resp.data;
            }
        },
        loginOut(){
            this.data = null;
            apiLoginOut()
        },
        async whoAmI(){
            this.isLoading = true;
            try {
                const resp = await apiWhoAmI()
                this.data = resp.data
            } catch (error) {
                this.data = null
            }
            this.isLoading = false;
        }
    }
})