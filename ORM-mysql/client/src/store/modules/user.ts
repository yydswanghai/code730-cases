import { defineStore } from 'pinia'
import { login as apiLogin, whoAmI as apiWhoAmI } from '@/api/user'

export const useUserStore = defineStore({
    id: 'app-user',
    state: () => ({
        data: null,
        isLoading: false,
    }),
    actions: {
        async login({ loginId, loginPwd }: any){
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
            localStorage.removeItem("token");
        },
        async whoAmI(){
            this.isLoading = true;
            try {
                const resp = await apiWhoAmI()
                if(resp.code === 0){
                    this.data = resp.data;
                }
            } catch (error) {
                this.data = null
            }
            this.isLoading = false;
        }
    }
})