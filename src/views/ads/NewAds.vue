<template>
    <div class="container" @click="hideList">
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                <h3 class="title">Crear nueva publicidad</h3>
                <form>
                    <div :class="productClass(v$.productId.$errors.length, listOpened)">
                        <div class="input-group">
                            <div class="form-floating">
                                <input autocomplete="off"
                                       class="form-control"
                                       :disabled="attrs.product.disabled"
                                       id="product"
                                       @keyup="searchProduct"
                                       placeholder="Product"
                                       type="text"
                                       v-model="data.product">
                                <label class="form-label">Tipo de publicidad</label>
                            </div>
                            <span class="input-group-text">
                                <i class="bi bi-search"></i>
                            </span>
                        </div>
                        <div class="wrapper-products-list" v-if="listOpened > 0">
                            <ul>
                                <li @click="productSelected(product.product_id, product.product_name)" v-for="(product, index) in productsList">{{ product.product_name }}</li>
                            </ul>
                        </div>
                        <div class="error-msg" v-for="error of v$.productId.$errors" :key="error.$uid">
                            <p>{{ error.$message }}</p>
                        </div>
                    </div>
                    <div class="row g-2 mb-3">
                        <div :class="(v$.amount.$errors.length > 0) ? 'field-error col-md input-wrapper' : 'col-md input-wrapper'">
                            <div class="form-floating">
                                <input class="form-control"
                                       :disabled="attrs.amount.disabled"
                                       placeholder="Amount"
                                       type="text"
                                       v-maska="amountMaskOpt"
                                       v-model="data.amount">
                                <label>Cantidad</label>
                            </div>
                            <div class="error-msg" v-for="error of v$.amount.$errors" :key="error.$uid">
                                <p>{{ error.$message }}</p>
                            </div>
                        </div>
                        <div :class="(v$.weighingUnit.$errors.length > 0) ? 'field-error col-md input-wrapper' : 'col-md input-wrapper'">
                            <div class="form-floating">
                                <select class="form-select" :disabled="attrs.weighingUnit.disabled" id="weighingUnits" v-model="data.weighingUnit">
                                    <option disabled selected value="">Seleccione</option>
                                    <option v-for="(unit, index) in weighingUnitsList" 
                                            :value="unit.weighing_unit_id">{{ unit.abbreviation }}</option>
                                </select>
                                <label for="floatingSelectGrid">Unidad de peso</label>
                            </div>
                            <div class="error-msg" v-for="error of v$.amount.$errors" :key="error.$uid">
                                <p>{{ error.$message }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="row g-2 mb-3">
                        <div :class="(v$.price.$errors.length > 0) ? 'field-error col-md input-wrapper' : 'col-md input-wrapper'">
                            <div class="form-floating">
                                <input class="form-control"
                                       :disabled="attrs.price.disabled"
                                       id="price"
                                       placeholder="Price"
                                       type="text"
                                       v-maska="priceMaskOpt"
                                       v-model="data.price">
                                <label>Precio</label>
                            </div>
                            <div id="priceHelpBlock" class="form-text">
                                Ejemplo: 1.250.908,80
                            </div>
                            <div class="error-msg" v-for="error of v$.price.$errors" :key="error.$uid">
                                <p>{{ error.$message }}</p>
                            </div>
                        </div>
                        <div :class="(v$.currency.$errors.length > 0) ? 'field-error col-md input-wrapper' : 'col-md input-wrapper'">
                            <div class="form-floating">
                                <select class="form-select" :disabled="attrs.currency.disabled" id="currencies" v-model="data.currency">
                                    <option disabled selected value="">Seleccione</option>
                                    <option v-for="(currency, index) in currenciesList" 
                                            :value="currency.currency_id">{{ currency.currency_desc }}</option>
                                </select>
                                <label for="floatingSelectGrid">Moneda</label>
                            </div>
                            <div class="error-msg" v-for="error of v$.currency.$errors" :key="error.$uid">
                                <p>{{ error.$message }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="row g-2 mb-3">
                        <div class="col">
                            <div class="alert alert-info" role="alert">
                                <p>A continuación debe elegir una dirección de origen de su producto; puede escribir su dirección 
                                y elegir una opción en la lista de sugerencias o arrastrar el marcado dentro del mapa a la ubicación deseada.</p>
                                <p><b>Tip:</b> puedes usar ambas opciones para obtener mayor precisión.</p>
                                <p class="mb-0"><b>Nota:</b> a los posibles compradores solo se les mostrará un radio aproximado de la ubicación, solo cuando se concrete la compra se mostrará la ubicación real.</p>
                            </div>
                        </div>
                    </div>
                    <div class="row g-2 mb-3">
                        <div class="col input-wrapper">
                            <div class="form-floating">
                                <input class="form-control"
                                       id="address"
                                       placeholder="Tipea una dirección o localidad"
                                       type="text">
                                <label>Escribe una dirección o localidad</label>
                            </div>
                            <div id="addressHelpBlock" class="form-text">
                                A medida que vayas escribiendo se te irá suguriendo direcciones
                            </div>
                        </div>
                    </div>  
                    <div class="row g-2 mb-3">
                        <div class="col map-wrapper">
                            <div id="map"></div>
                        </div>
                    </div>
                    <div class="row g-2 mb-3 wrapper-map-help-block">
                        <div class="col">
                            <div class="form-text">
                                Puedes arrastrar el marcador dentro del mapa para mayor precisión.
                            </div>
                        </div>
                    </div>
                    <div class="row g-2 mb-3">
                        <div :class="(v$.address.$errors.length > 0) ? 'field-error col-md input-wrapper' : 'col-md input-wrapper'">
                            <input class="form-control"
                                   disabled="disabled"
                                   id="address"
                                   placeholder="Dirección"
                                   type="text"
                                   v-model="data.address">
                            <div class="error-msg" v-for="error of v$.address.$errors" :key="error.$uid">
                                <p>{{ error.$message }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="d-grid">
                        <button :disabled="attrs.sellButton.disabled"
                                @click="confirmSale"
                                class="btn btn-filled"
                                id="btn-sell"
                                type="button"
                                v-html="attrs.sellButton.html"></button>
                        <Alert @iAgree="iAgree" @noAgree="noAgree" :options="alertProps" />
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>

import { defineComponent, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import Alert from '../components/Alert.vue'
import { ajax } from '../../utils/AjaxRequest'
import { vMaska } from 'maska/vue'

export default defineComponent({
    directives: { 
        maska: vMaska 
    },
    components: {
        Alert
    },
    setup() {

        onBeforeMount(() => {
            currencies()
        })

        onMounted(() => {

            attrs.sellButton.html = attrs.sellButton.initHtml
            attrs.sellButton.disabled = false
            attrs.product.disabled = false

            if(route.query.message) {

                let alertData = {
                    message: route.query.message,
                    show: true,
                    type: route.query.type_response
                }
                Object.assign(alertProps, alertData)

            }

            initMap()

        })

        const alertProps = reactive({
            iconCloseButton: false,
            message: "",
            show: false,
            timer: 0,
            type: null
        })
        const amountMaskOpt = reactive({
            eager: true,
            mask: "#,##",
            number: {
                fraction: 2,
                locale: 'de',
                unsigned: true           
            },
            reversed: true           
        })
        const center = { lat: 40.689247, lng: -74.044502 }
        const currenciesList = ref()
        const encryptionStore = useEncryptionStore()
        const listOpened = ref(0)
        const loader = new Loader({
            apiKey: import.meta.env.VITE_GOOGLE_MAP_KEY
        })
        const marker = ref()
        const priceMaskOpt = reactive({
            eager: true,
            mask: "#,##",
            number: {
                fraction: 2,
                locale: 'de',
                unsigned: true           
            },
            reversed: true           
        })
        const productIdSelected = ref(null)
        const productsList = ref()
        const route = useRoute()
        const weighingUnitsList = ref([])

        const data = reactive({
            address: "",
            addressLatLng: "",
            amount: "",
            confirmed: 0,
            currency: "",
            price: null,
            product: "",
            productId: null,
            weighingUnit: ""
        })
        
        const attrs = reactive({
            amount: {
                disabled: true,
                format: {
                    decimal: ',',
                    separator: '.',
                    precision: 2,
                    masked: false,
                    min: "0,00",
                    nullValue: "0,00"
                }
            },
            currency: {
                disabled: true
            },
            price: {
                disabled: true
            },
            product: {
                disabled: true
            },
            sellButton:{
                disabled: true,
                html: "",
                initHtml: 'Crear publicidad',
                loadingHtml: '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only"> Cargando</span>'
            },
            weighingUnit: {
                disabled: true
            }
        });
        
        const rules = {
            productId: { required: helpers.withMessage('Requerido', required) },
            amount: { required: helpers.withMessage('Requerido', required) },
            weighingUnit: { required: helpers.withMessage('Requerido', required) },
            price: { required: helpers.withMessage('Requerido', required) },
            currency: { required: helpers.withMessage('Requerido', required) },
            address: { required: helpers.withMessage('Requerido', required) }
        }

        const v$ = useVuelidate(rules, data, { $scope: false })
        
        onBeforeRouteLeave((to, from, next) => {
            alertProps.show = false
            next();
        })

        const confirmSale = async function() {
       
            alertProps.show = false
            data.confirmed = 0

            let isFormCorrect = await this.v$.$validate()
            if(isFormCorrect) {
                
                attrs.sellButton.disabled = true
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

        const currencies = () => {
           
            let ajaxData = {
                method: "get",
                url: import.meta.env.VITE_API_BASE_URL+"/general/active-currencies"
            }

            ajax(ajaxData)
            .then(function (response) {
                
                if(response.status === 200 && response.data.response) {

                    currenciesList.value = response.data.response.currencies

                }

            })
            .catch(error => {

                attrs.sellButton.disabled = false
                attrs.sellButton.html =  attrs.sellButton.initHtml

                if(error.message) {

                    let alertData = {
                        close: (error.close) ? error.close : false,
                        message: error.message,
                        show: true,
                        timer: (error.timer) ? error.timer : false,
                        timerSeconds: (error.timerSeconds) ? error.timerSeconds : 0,
                        type: (error.type) ? error.type : "error"
                    }

                    Object.assign(alertProps, alertData)

                }

            })  

        }

        const hideList = () => {
         
            if (listOpened.value) {
                listOpened.value = 0
            }
            
        }

        const iAgree = () => {

            alertProps.show = false
            attrs.sellButton.html = attrs.sellButton.loadingHtml

            let ajaxData = {
                method: "post",
                params: {
                    amount: stringToNumber(data.amount),
                    confirmed: data.confirmed,
                    currencyId: data.currency,
                    langId: 1,
                    latitude: data.addressLatLng.lat,
                    longitud: data.addressLatLng.lng,
                    price: stringToNumber(data.price),
                    productId: data.productId,
                    userId: 1,
                    weighingUnitId: data.weighingUnit
                },
                url: import.meta.env.VITE_API_BASE_URL+"/orders/create-sell-order"
            }
     
            ajax(ajaxData)
            .then(function (response) {

                console.log(response.data.response)
                
                attrs.sellButton.html = attrs.sellButton.initHtml
                attrs.sellButton.disabled = false

                if(response.status === 200 && response.data.response) {

                    if(response.data.response.statusCode === 1) {

                        data.address = ""
                        data.addressLatLng = ""
                        data.amount = ""
                        data.confirmed = 0
                        data.currency = ""
                        data.price = null
                        data.product = "",
                        data.productId = null,
                        data.weighingUnit = ""
                        document.getElementById("address").value = ''

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

                        attrs.sellButton.disabled = false
                        console.log("ERROR LOGIN CODIGO NO DEFINIDO")

                    }

                    Object.assign(alertProps, alertData)

                } else {

                    console.log("ERROR LOGIN")

                }

            })
            .catch(error => {

                attrs.sellButton.disabled = false
                console.log(error)

            })

        }

        const initMap = () => {

            loader.load().then(async () => {

                var map = null

                const { Map } = await google.maps.importLibrary("maps")
                const latLng = { lat: 10.17714270000001, lng: -68.25922953862305 }
                map = new Map(document.getElementById("map"), {
                    center: latLng,
                    mapTypeControl: false,
                    streetViewControl: false,
                    zoom: 13,
                    mapId: "sell-address"
                })

                markerMap(map, latLng)
                searchPlaces(map)

                /*if (navigator.geolocation) {

                    navigator.geolocation.getCurrentPosition((position) => {

                        const pos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        }

                        map.value.setCenter(pos)
                        console.log("SAPE")
                    }, () => {
                        console.log("NO SAPE")
                        map.value.getCenter(latLng)
                    })

                } else {
                    
                    const pos = {
                        lat: -34.397,
                        lng: 150.644,
                    }
                    map.value.setCenter(pos)

                }*/

            })
            
        }

        const markerMap = async (map, latLng) => {

            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker")
            const geocoder = new google.maps.Geocoder()
           
            marker.value = new AdvancedMarkerElement({
                gmpDraggable: true,
                position: latLng,
                map: map,
                title: "¡Arrastrame!"
            })
            marker.value.addListener("dragend", () => {
               
                geocoder.geocode({ location: { lat: marker.value.position.lat, lng: marker.value.position.lng } })
                .then((response) => {
                     
                    data.addressLatLng = { lat: marker.value.position.lat, lng: marker.value.position.lng }

                    let region = response.results.reverse()

                    for (let index = 0; index < region.length; index++) {

                        const element = region[index]
                        const formattedAddress = element.formatted_address

                        if(element.types.includes("locality")) {
                            data.address = formattedAddress
                            break
                        } else if(element.types.includes("route")) {
                     
                            if(!formattedAddress.toUpperCase().includes("VÍA SIN NOMBRE")) {
                                data.address = formattedAddress    
                                break
                            }
                            
                        } else if(element.types.includes("plus_code")) {
                            data.address = formattedAddress
                            break
                        } else {
                            data.address = "Se tomará la Latitud y Logitud donde colocaste el marcador"
                        }

                    }

                })
                .catch((e) => {
                    console.log("error en traducir las coordenadas")
                })

            })

        }

        const productClass = (error, listOpened) => {
            
            let index = (error + listOpened)
            let className = {
                0: "mb-3 input-wrapper",
                1: "field-error mb-3 input-wrapper",
                2: "mb-3 input-wrapper list-opened",
                3: "field-error mb-3 input-wrapper list-opened"
            }

            return className[index]
           
        }

        const noAgree = () => {
            attrs.sellButton.disabled = false
        }

        const productSelected = (productId, productName) => {

            data.product = productName
            data.productId = productId
            listOpened.value = 0
            productIdSelected.value = productId
            weighingUnits()

        } 

        const searchPlaces = async (map) => {

            await google.maps.importLibrary("places")
            const input = document.getElementById("address")
            const options = {
                componentRestrictions: { country: "ve" },
                fields: ["address_components", "geometry", "icon", "name"],
                strictBounds: false
            }
            const autocomplete = new google.maps.places.Autocomplete(input, options)

            autocomplete.addListener("place_changed", () => {

                const place = autocomplete.getPlace()

                if (!place.geometry || !place.geometry.location) {

                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                    window.alert("No details available for input: '" + place.name + "'");
                    return;

                } else {

                    data.addressLatLng = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }

                }
                
                if (place.geometry.viewport) {
                    map.fitBounds(place.geometry.viewport)
                    marker.value.position = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()}
                } else {
                    // NO PROBADO ESTE ELSE
                    map.setCenter(place.geometry.location)
                    map.setZoom(17)
                    marker.value.position = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()}
                }

                const addressComponents = place.address_components
                var addressText = ""

                for (let index = 0; index < addressComponents.length; index++) {

                    const address = addressComponents[index]

                    if(index === 0) {
                        addressText = address.long_name
                    } else {
                        addressText = addressText+", "+address.long_name
                    }

                }

                data.address = addressText

            })

        }

        const searchProduct = () => {

            productIdSelected.value = null
            attrs.amount.disabled = true
            attrs.weighingUnit.disabled = true
            data.productId = null

            if(data.product.trim().length > 3) {

                let ajaxData = {
                    method: "get",
                    params: {
                        product: data.product.toLowerCase(),
                        langId: userAccountStore.state.langId
                    },
                    url: import.meta.env.VITE_API_BASE_URL+"/products/searching-products"
                }

                ajax(ajaxData)
                .then(function (response) {

                    if(response.status === 200 && response.data.response) {

                        attrs.amount.disabled = false
                        attrs.currency.disabled = false
                        attrs.price.disabled = false
                        attrs.weighingUnit.disabled = false

                        productsList.value = response.data.response.products
                        listOpened.value = (response.data.response.products.length > 0) ? 2 : 0

                    }

                })
                .catch(error => {

                    attrs.sellButton.disabled = false
                    attrs.sellButton.html =  attrs.sellButton.initHtml

                    if(error.message) {

                        let alertData = {
                            close: (error.close) ? error.close : false,
                            message: error.message,
                            show: true,
                            timer: (error.timer) ? error.timer : false,
                            timerSeconds: (error.timerSeconds) ? error.timerSeconds : 0,
                            type: (error.type) ? error.type : "error"
                        }

                        Object.assign(alertProps, alertData)

                    }

                })   

            } else {

                listOpened.value = 0

            }

        }

        const stringToNumber = (string) => {

            return parseFloat(string.replace('.','').replace(',','.')).toFixed(2)

        }

        const weighingUnits = () => {

            let ajaxData = {
                method: "get",
                params: {
                    productId: productIdSelected.value,
                    langId: userAccountStore.state.langId
                },
                url: import.meta.env.VITE_API_BASE_URL+"/products/product-weighing-units"
            }

            ajax(ajaxData)
            .then(function (response) {

                if(response.status === 200 && response.data.response) {
                    
                    if(response.data.response.weighingUnits.length === 1) {
                        data.weighingUnit = response.data.response.weighingUnits[0].weighing_unit_id
                    }

                    weighingUnitsList.value = response.data.response.weighingUnits
                
                }

            })
            .catch(error => {

                attrs.sellButton.disabled = false
                attrs.sellButton.html =  attrs.sellButton.initHtml

                if(error.message) {

                    let alertData = {
                        close: (error.close) ? error.close : false,
                        message: error.message,
                        show: true,
                        timer: (error.timer) ? error.timer : false,
                        timerSeconds: (error.timerSeconds) ? error.timerSeconds : 0,
                        type: (error.type) ? error.type : "error"
                    }

                    Object.assign(alertProps, alertData)

                }

            })

        }

        return {
            alertProps,
            amountMaskOpt,
            attrs,
            center,
            confirmSale,
            currenciesList,
            data,
            encryptionStore,
            hideList,
            iAgree,
            listOpened,
            noAgree,
            priceMaskOpt,
            productClass,
            productsList,
            productSelected,
            searchProduct,
            v$,
            weighingUnitsList
        }

    }
})

</script>

<style lang="less" src="../../assets/less/ads/Index.less" scoped></style>