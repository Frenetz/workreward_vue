<template>
	<div class="container mt-5">
		<div class="row justify-content-center">
		<div class="col-md-6">
			<h1 class="text-center mb-4">Войти</h1>
			<div v-if="registrationSuccess" class="alert alert-success">
			Регистрация прошла успешно! Пожалуйста, войдите в систему.
			</div>
			<div v-if="changePasswordSuccess" class="alert alert-success">
			Вы успешно изменили пароль! Пожалуйста, войдите в систему.
			</div>
			<form @submit.prevent="submitForm">
			<div class="mb-3">
				<input
				type="text"
				v-model="form.username"
				class="form-control"
				placeholder="Логин | Email"
				required
				/>

				<div v-if="errors.username" class="text-danger">
				<span>{{ errors.username[0] }}</span>
				</div>
			</div>
	
			<div class="mb-3">
				<input
				type="password"
				v-model="form.password"
				class="form-control"
				placeholder="Пароль"
				required
				/>

				<div v-if="errors.password" class="text-danger">
				<span>{{ errors.password[0] }}</span>
				</div>
			</div>
	
			<div class="text-center">
				<button type="submit" class="btn btn-primary w-100">
				Войти
				</button>
			</div>
			</form>

			<div v-if="globalErrors.length" class="alert alert-danger mt-3">
			<ul>
				<li v-for="(error, index) in globalErrors" :key="index">{{ error }}</li>
			</ul>
			</div>
	
			<p class="text-center mt-3">
			<router-link to="/reset-password">Забыли пароль?</router-link>
			</p>
		</div>
		</div>
	</div>
</template>
	
	
<script>
import axios from '../../utils/axiosConfig';
export default {
	computed: {
	registrationSuccess() {
		return this.$route.query.registrationSuccess === 'true';
	},
	changePasswordSuccess() {
		return this.$route.query.changePasswordSuccess === 'true';
	}
	},
	data() {
	return {
		form: {
			username: '',
			password: '',
		},
		errors: {},
		globalErrors: [],
	};
	},
	methods: {
	submitForm() {
		this.$router.replace({
			path: this.$route.path,
			query: {},
		});
		this.errors = {};
		this.globalErrors = [];

		const formData = {
			username: this.form.username,
			password: this.form.password,
		};

		axios.post(`${process.env.VUE_APP_API_URL}/users/login/`, formData)
		.then(response => {
			localStorage.setItem('access_token', response.data.user.access);
			localStorage.setItem('refresh_token', response.data.user.refresh);
			localStorage.setItem('id', response.data.user.id);
			localStorage.setItem('is_manager', response.data.user.is_manager);
			this.$emit('authenticated', true);
			this.$router.push({ name: 'index' });
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
	