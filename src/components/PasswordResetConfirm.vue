<template>
	<div class="container mt-5">
		<div class="row justify-content-center">
		<div class="col-md-6">
			<h1 class="text-center mb-4">Восстановление пароля</h1>
			<form @submit.prevent="submitForm">
			<div class="mb-3">
				<input
				type="password"
				v-model="form.password"
				class="form-control"
				placeholder="Пароль"
				required
				/>

				<div v-if="errors.new_password1" class="text-danger">
				<span>{{ errors.new_password1[0] }}</span>
				</div>
			</div>
	
			<div class="mb-3">
				<input
				type="password"
				v-model="form.password2"
				class="form-control"
				placeholder="Повторите пароль"
				required
				/>

				<div v-if="errors.new_password2" class="text-danger">
					<span>{{ errors.new_password2[0] }}</span>
				</div>
			</div>
	
			<div class="text-center">
				<button type="submit" class="btn btn-primary w-100">
				Изменить пароль
				</button>
			</div>
			</form>

			<div v-if="globalErrors.length" class="alert alert-danger mt-3">
			<ul>
				<li v-for="(error, index) in globalErrors" :key="index">{{ error }}</li>
			</ul>
			</div>
		</div>
		</div>
	</div>
</template>
	
	
<script>
import axios from '../../utils/axiosConfig';
export default {
  props: {
    uidb64: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  data() {
	return {
		form: {
			password: '',
			password2: '',
		},
		errors: {},
		globalErrors: [],
	}
  },
  created() 
  { 
	console.log('UIDB64:', this.uidb64);
	console.log('Token:', this.token);
  },
  methods: {
	submitForm() {
		this.errors = {};
		this.globalErrors = [];

		const formData = {
			new_password1: this.form.password,
			new_password2: this.form.password2,
			uidb64: this.uidb64,
			token: this.token
		};

		axios.post(`${process.env.VUE_APP_API_URL}/users/password-reset-confirm/`, formData)
		.then(response => {
			console.log('Успех:', response.data.user.access);
			this.$router.push({ name: 'auth', query: {changePasswordSuccess: true} });
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
	}
  }
};
</script>

	
	
<style scoped>
</style>
	