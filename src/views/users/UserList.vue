<template>
    <div class="container" @click="hideList">
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-6">
                <h5 class="title">Actualmente existen {{ activeUsers }} usuarios activos </h5>
                <h3 class="title">Buscar usuario</h3>
                <form class="row">
                    <div class="col">
                        <div :class="userListClass(v$.userId.$errors.length, listOpened)">
                            <div class="input-group">
                                <input autocomplete="off"
                                       class="form-control"
                                       id="usersList"
                                       @keyup="searchUsers"
                                       placeholder="Empieza a escribir para empezar a buscar"
                                       type="text"
                                       v-model="data.user">
                                <span class="input-group-text">
                                    <i class="bi bi-chevron-down"></i>
                                </span>
                            </div>
                            <div class="wrapper-users-list" v-if="listOpened > 0">
                                <ul>
                                    <li @click="userSelected(data.user_id)" v-for="(data, index) in usersList">{{ data.name }} (C.I: {{ data.dni }})</li>
                                </ul>
                            </div>
                            <div id="usersListHelpText" class="form-text">
                                Puedes buscar por nombre, cédula o correo electrónico
                            </div>
                            <div class="error-msg" v-for="error of v$.userId.$errors" :key="error.$uid">
                                <p>{{ error.$message }}</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="row justify-content-center wrapper-user-info" v-if="data.userId">
            <div class="col-12 col-md-8 col-lg-6">
                <h3 class="title">Información del usuario</h3>
                <form>
                    <div class="mb-3">
                        <label for="name" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="name" aria-describedby="nameHelp" v-model="data.userInfo.name">
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Correo electrónico</label>
                        <input type="text" class="form-control" id="email" v-model="data.userInfo.email">
                    </div>
                    <div class="mb-3">
                        <label for="dni" class="form-label">Cédula de identidad</label>
                        <input type="text" class="form-control" id="dni" v-model="data.userInfo.dni">
                    </div>
                    <div class="mb-3">
                        <label for="amount" class="form-label">Balance</label>
                        <div class="input-group">
                            <span class="input-group-text" id="basic-addon1">{{ data.userInfo.balance.currencySymbol }}</span>
                            <input type="text" 
                                   class="form-control" 
                                   id="amount"        
                                   v-model="data.userInfo.balance.amount"
                                   v-maska="amountMaskOpt">
                        </div>
                    </div>
                    <button @click="saveUserInfo" type="button" class="btn btn-primary">Guardar</button>
                </form>
                <Alert :options="alertProps" />
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent, onMounted, reactive, ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import Alert from '../components/Alert.vue';
import { ajax } from '../../utils/AjaxRequest';
import { vMaska } from 'maska/vue';

export default defineComponent({
    directives: { 
        maska: vMaska 
    },
    components: {
        Alert
    },
    setup() {

        const activeUsers = ref(0);
        const alertProps = reactive({
            iconCloseButton: false,
            message: "",
            show: false,
            timer: 0,
            type: null
        });

        const amountMaskOpt = reactive({
            eager: false,
            //mask: "#,###",
            number: {
                fraction: 3,
                locale: 'de',
                unsigned: true      
            },
            reversed: false           
        });
        const amountMaskFormatter = new Intl.NumberFormat(amountMaskOpt.number.locale);
      
        const attrs = reactive({
            searchInput: {
                disabled: false,
            }
        }); 
        const data = reactive({
            user: "",
            userId: null,
            userInfo: {
                balance: {
                    amount: "",
                    currencyId: "",
                    currencySymbol: ""
                },
                email: "",
                dni: "",
                name: ""
            }
        });
        const listOpened = ref(0);
        //const userIdSelected = ref(null);
        const usersList = ref();
        const rules = {
            userId: { required: helpers.withMessage('Requerido', required) }
        }

        const getActiveUsers = () => {
            
            let ajaxData = {    
                method: "get",
                params: {},
                url: import.meta.env.VITE_API_BASE_URL+"/users/active-users"
            };
        
            ajax(ajaxData)
            .then(function (rs) {
               
                if(rs.status === 200 && rs.data) {

                    activeUsers.value = rs.data.users

                };

            })
            .catch(error => {

                console.log(error);

                if(error.message) {

                    /*let alertData = {
                        close: (error.close) ? error.close : false,
                        message: error.message,
                        show: true,
                        timer: (error.timer) ? error.timer : false,
                        timerSeconds: (error.timerSeconds) ? error.timerSeconds : 0,
                        type: (error.type) ? error.type : "error"
                    }

                    Object.assign(alertProps, alertData)*/

                };

            }); 

        }

        const userListClass = (error, listOpened) => {
            
            let index = (error + listOpened);
            let className = {
                0: "input-wrapper col-12",
                1: "field-error input-wrapper col-12",
                2: "input-wrapper list-opened col-12",
                3: "field-error input-wrapper list-opened col-12"
            };

            return className[index];
           
        };
        
        const v$ = useVuelidate(rules, data, { $scope: false })
        
        const hideList = () => {
         
            if (listOpened.value) {

                listOpened.value = 0;
                data.userId = null;

            };
            
        }

        const saveUserInfo = () => {
            
            alertProps.show = false;

            let ajaxData = {    
                method: "post",
                params: {
                    userId: data.userId,
                    currencyId: data.userInfo.balance.currencyId,
                    balance: stringToNumber(data.userInfo.balance.amount),
                    email: data.userInfo.email,
                    dni: data.userInfo.dni,
                    name: data.userInfo.name
                },
                url: import.meta.env.VITE_API_BASE_URL+"/users/save-user-info"
            };
        
            ajax(ajaxData)
            .then(function (response) {
                
                if(response.status === 200 && response.data.response) {

                    let alertData = {
                        close: true,
                        message: "Usuario actualizado con éxito",
                        show: true,
                        timer: false,
                        timerSeconds: 0,
                        type: "success"
                    }

                    Object.assign(alertProps, alertData)

                };

            })
            .catch(error => {

                console.log(error);

                if(error.message) {

                    /*let alertData = {
                        close: (error.close) ? error.close : false,
                        message: error.message,
                        show: true,
                        timer: (error.timer) ? error.timer : false,
                        timerSeconds: (error.timerSeconds) ? error.timerSeconds : 0,
                        type: (error.type) ? error.type : "error"
                    }

                    Object.assign(alertProps, alertData)*/

                };

            }); 

        }

        const searchUsers = () => {
            
            //userIdSelected.value = null;
            //data.userId = null;
            alertProps.show = false;

            if(data.user.trim().length > 3) {
               
                let ajaxData = {    
                    method: "get",
                    params: {
                        userString: data.user.toLowerCase()
                    },
                    url: import.meta.env.VITE_API_BASE_URL+"/users/search-users"
                };
            
                ajax(ajaxData)
                .then(function (response) {
                    
                    if(response.status === 200 && response.data.users) {

                        usersList.value = response.data.users;
                        listOpened.value = (response.data.users.length > 0) ? 2 : 0;

                    };

                })
                .catch(error => {

                    console.log(error);

                    if(error.message) {

                        /*let alertData = {
                            close: (error.close) ? error.close : false,
                            message: error.message,
                            show: true,
                            timer: (error.timer) ? error.timer : false,
                            timerSeconds: (error.timerSeconds) ? error.timerSeconds : 0,
                            type: (error.type) ? error.type : "error"
                        }

                        Object.assign(alertProps, alertData)*/

                    };

                }); 

            } else {

                listOpened.value = 0;

            };

        };

        const stringToNumber = (string) => {

            return parseFloat(string.replace('.','').replace(',','.')).toFixed(3);

        };

        const userSelected = (userId) => {

            /*data.user = userName;
            data.userId = userId;
            listOpened.value = 0;
            userIdSelected.value = userId;
*/

            let ajaxData = {    
                method: "get",
                params: {
                    userId: userId
                },
                url: import.meta.env.VITE_API_BASE_URL+"/users/user-info"
            };
     
            ajax(ajaxData)
            .then(function (response) {

                console.log(response.data.userInfo)
                if(response.status === 200 && response.data.userInfo) {
                  
                    data.userId = response.data.userInfo.user_id;
                    data.userInfo.balance.currencyId = response.data.userInfo.currency_id,
                    data.userInfo.balance.amount = amountMaskFormatter.format(response.data.userInfo.amount);
                    data.userInfo.balance.currencySymbol = response.data.userInfo.currency_symbol;
                    data.userInfo.email = response.data.userInfo.email;
                    data.userInfo.dni = response.data.userInfo.dni;
                    data.userInfo.name = response.data.userInfo.name;

                } else {

                    console.log("ERROR LOGIN")

                }

            })
            .catch(error => {

                console.log(error)

            });

        };

        onMounted(() => {

            getActiveUsers();

        });

        return {
            activeUsers,
            alertProps,
            amountMaskOpt,
            attrs,
            data,
            hideList,
            listOpened,
            userListClass,
            usersList,
            saveUserInfo,
            searchUsers,
            userSelected,
            v$
        }

    }
})

</script>

<style lang="less" src="../../assets/less/users/UserList.less" scoped></style>