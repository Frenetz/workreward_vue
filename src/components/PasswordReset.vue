<template>
	<div class="container mt-5">
		<div class="row justify-content-center">
		<div class="col-md-6">
			<h1 class="text-center mb-4">Восстановить пароль</h1>
			<div v-if="message" class="alert alert-success">
				{{ message }}
			</div>
			<form @submit.prevent="submitForm">

			<div class="mb-3">
				<div class="mb-3">
					<input
					type="text"
					v-model="form.email"
					class="form-control"
					placeholder="Email"
					required
					/>
				</div>

				<div v-if="errors.email" class="text-danger">
				<span>{{ errors.email[0] }}</span>
				</div>
			</div>

			<div v-if="globalErrors.length" class="alert alert-danger mt-3">
			<ul>
				<li v-for="(error, index) in globalErrors" :key="index">{{ error }}</li>
			</ul>
			</div>

			<div class="text-center">
				<button type="submit" class="btn btn-primary w-100">
					Сбросить пароль
				</button>
			</div>
			</form>
		</div>
		</div>
	</div>
</template>
	
<script>
import axios from '../../utils/axiosConfig';
export default {
data() {
	return {
		message: '',
		form: {
			email: '',
		},
		errors: {},
		globalErrors: [],
	};
},
methods: {
	submitForm() {
		this.message = '';
		this.errors = {};
		this.globalErrors = [];

		const formData = {
			email: this.form.email,

		};

		axios.post(`${process.env.VUE_APP_API_URL}/users/password-reset/`, formData)
		.then(response => {
			console.log('Успех:', response.data.user.access);
			this.message = response.data.user.message;

		})
		.catch(error => {
			if (error.response) {
			if (error.response.data.user) {
				this.errors = error.response.data.user;
			}

			if (error.response.data.user && error.response.data.user.detail) {
				this.globalErrors = error.response.data.user.detail;
			}
			} else {
				alert('Ошибка сети или сервера.');
			}
		});			
	},
},
};
</script>
	
<style scoped>
</style>
	