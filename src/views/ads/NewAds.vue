<template>
    <div class="container" @click="hideList">
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                <h3 class="title">Crear nueva publicidad</h3>
                <form>
                    <div class="row g-2 mb-3">
                        <div :class="(v$.adFile.$errors.length > 0) ? 'field-error col input-wrapper' : 'col input-wrapper'">
                            <div class="form-floating">
                                <input @change="newFileLoaded" class="form-control" type="file" id="adFile">
                                <label for="formFile" class="form-label">Archivo de la publicidad</label>
                            </div>
                            <div class="error-msg" v-for="error of v$.adFile.$errors" :key="error.$uid">
                                <p>{{ error.$message }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="row g-2 mb-3">
                        <div :class="(v$.playTime.$errors.length > 0) ? 'field-error col-md input-wrapper' : 'col-md input-wrapper'">
                            <div class="form-floating">
                                <input class="form-control"
                                       :disabled="attrs.playTime.disabled"
                                       id="playTime"
                                       maxlength="3"
                                       placeholder="Tiempo de reproducción"
                                       type="text"
                                       v-maska="playTimeMaskOpt"
                                       v-model="data.playTime">
                                <label>Tiempo de reproducción</label>
                            </div>
                            <div id="playTimeHelpBlock" class="form-text">
                                Ejemplo: 1, 30, 90 segundos
                            </div>
                            <div class="error-msg" v-for="error of v$.playTime.$errors" :key="error.$uid">
                                <p>{{ error.$message }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="d-grid">
                        <button :disabled="attrs.saveButton.disabled"
                                @click="confirmSale"
                                class="btn btn-filled"
                                id="btn-sell"
                                type="button"
                                v-html="attrs.saveButton.html"></button>
                        <Alert @iAgree="iAgree" @noAgree="noAgree" :options="alertProps" />
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent, onBeforeMount, onMounted, reactive, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import Alert from '../components/Alert.vue'
import { ajax } from '../../utils/AjaxRequest'
import { vMaska } from 'maska/vue'
//import FormData from 'form-data';

export default defineComponent({
    directives: { 
        maska: vMaska 
    },
    components: {
        Alert
    },
    setup() {

        onMounted(() => {
          
            attrs.saveButton.html = attrs.saveButton.initHtml
            attrs.saveButton.disabled = false

        })

        const alertProps = reactive({
            iconCloseButton: false,
            message: "",
            show: false,
            timer: 0,
            type: null
        })

        const playTimeMaskOpt = reactive({
            eager: true,
            mask: "#",
            number: {
                fraction: 0,
                unsigned: true           
            },
            reversed: true           
        })

        const data = reactive({
            adFile: {
                ext: "",
                file: null
            },
            playTime: "",
            confirmed: 0
        })
        
        const attrs = reactive({
            playTime: {
                disabled: false
            },
            saveButton:{
                disabled: true,
                html: "",
                initHtml: 'Crear publicidad',
                loadingHtml: '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only"> Cargando</span>'
            }
        });
        
        const rules = {
            adFile: {
                ext: { required: helpers.withMessage('Requerido', required) }
            },
            playTime: { required: helpers.withMessage('Requerido', required) }
        }

        const v$ = useVuelidate(rules, data, { $scope: false })

        const confirmSale = async function() {
       
            alertProps.show = false
            data.confirmed = 0

            let isFormCorrect = await this.v$.$validate()
            if(isFormCorrect) {
                
                attrs.saveButton.disabled = true
                let alertData = {
                    iAgreeButton: {
                        show: true,
                        text: 'Si'
                    },
                    message: "¿Estás seguro de realizar esta acción?",
                    noAgreeButton: {
                        show: true,
                        text: 'No'
                    },
                    show: true,
                    timer: false,
                    timerSeconds: 0,
                    type: "confirm"
                }
                Object.assign(alertProps, alertData)                

            }

        }

        const iAgree = () => {

            alertProps.show = false
            attrs.saveButton.html = attrs.saveButton.loadingHtml
            
            //const formData = new FormData(document.querySelector('form'));
            const formData = new FormData();
            formData.append('file', data.adFile.file);
            formData.append('playTime', data.playTime);
 
            let ajaxData = {
                method: "post",
                formData: formData,
                url: import.meta.env.VITE_API_BASE_URL+"/ads/create-new-ad"
            }
     
            ajax(ajaxData)
            .then(function (response) {
                
                attrs.saveButton.html = attrs.saveButton.initHtml
                attrs.saveButton.disabled = false

                if(response.status === 200 && response.data.response) {

                    if(response.data.response.statusCode === 1) {

                        data.address = ""
                        data.addressLatLng = ""
                        data.confirmed = 0
                        //document.getElementById("address").value = ''
                        document.querySelector('form').reset()

                        v$.value.$reset()

                        var alertData = {
                            message: response.data.response.message,
                            show: true,
                            timer: true,
                            timerSeconds: 5,
                            type: "success"
                        }

                    } else if(response.data.response.statusCode === 4) {

                        data.confirmed = 1
                        var alertData = {
                            iAgreeButton: {
                                show: true,
                                text: 'Si'
                            },
                            message: response.data.response.message,
                            noAgreeButton: {
                                show: true,
                                text: 'No'
                            },
                            show: true,
                            timer: false,
                            timerSeconds: 0,
                            type: "confirm"
                        }   

                    } else {

                        attrs.saveButton.disabled = false
                        console.log("ERROR LOGIN CODIGO NO DEFINIDO")

                    }

                    Object.assign(alertProps, alertData)

                } else {

                    console.log("ERROR LOGIN")

                }

            })
            .catch(error => {

                attrs.saveButton.html = attrs.saveButton.initHtml
                attrs.saveButton.disabled = false
                console.log(error)

            })

        }

        const newFileLoaded = () => {

            data.adFile.file = document.getElementById('adFile').files[0];
            let fileName = data.adFile.file.name;
            data.adFile.ext = fileName.split('.').at(-1);

        }

        const noAgree = () => {
            attrs.saveButton.disabled = false
        }

        const stringToNumber = (string) => {

            return parseFloat(string.replace('.','').replace(',','.')).toFixed(2)

        }

        return {
            alertProps,
            attrs,
            confirmSale,
            data,
            iAgree,
            newFileLoaded,
            noAgree,
            playTimeMaskOpt,
            v$
        }

    }
})

</script>

<style lang="less" src="../../assets/less/ads/Index.less" scoped></style>