<template>
	<div class="container mt-5">
		<div class="row justify-content-center">
			<div class="col-md-6">
				<h1 class="text-center mb-4">Зарегистрироваться</h1>
				<form @submit.prevent="submitForm">

					<div class="mb-3">
						<input
							type="text"
							v-model="form.username"
							class="form-control"
							placeholder="Логин"
							required
						/>

						<div v-if="errors.username" class="text-danger">
							<span>{{ errors.username[0] }}</span>
						</div>
					</div>

					<div class="mb-3">
						<input
							type="email"
							v-model="form.email"
							class="form-control"
							placeholder="Email"
							required
						/>

						<div v-if="errors.email" class="text-danger">
							<span>{{ errors.email[0] }}</span>
						</div>
					</div>

					<div class="mb-3">
						<input
							type="text"
							v-model="form.firstName"
							class="form-control"
							placeholder="Имя"
							required
						/>
					</div>

					<div class="mb-3">
						<input
							type="text"
							v-model="form.lastName"
							class="form-control"
							placeholder="Фамилия"
							required
						/>
					</div>

					<div class="mb-3">
						<input
							type="text"
							v-model="form.middleName"
							class="form-control"
							placeholder="Отчество (необязательное)"
						/>
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

					<div class="mb-3">
						<input
							type="password"
							v-model="form.confirmPassword"
							class="form-control"
							placeholder="Повторите пароль"
							required
						/>
					</div>

					<div class="mb-3">
						<input
							type="text"
							v-model="form.managerCode"
							class="form-control"
							placeholder="Код для менеджера (необязательное)"
						/>
					</div>

					<div class="text-center">
						<button type="submit" class="btn btn-primary w-100">
							Зарегистрироваться
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
	data() {
	return {
		form: {
		username: '',
		email: '',
		firstName: '',
		lastName: '',
		middleName: '',
		password: '',
		confirmPassword: '',
		managerCode: '',
		},
		errors: {},
		globalErrors: [],
	};
	},
	methods: {
	submitForm() {
		this.errors = {};
		this.globalErrors = [];

		if (this.form.password !== this.form.confirmPassword) {
		this.errors.password = ['Пароли не совпадают'];
		return;
		}

		const formData = {
		username: this.form.username,
		email: this.form.email,
		first_name: this.form.firstName,
		last_name: this.form.lastName,
		patronymic: this.form.middleName || '',
		password: this.form.password,
		password2: this.form.confirmPassword,
		};

		if (this.form.managerCode) {
		formData.manager_code = this.form.managerCode;
		}

		axios.post(`${process.env.VUE_APP_API_URL}/users/register/`, formData)
		.then(response => {
			console.log('Успех:', response.data);

			this.$router.push({ name: 'auth', query: { registrationSuccess: true } });
		})
		.catch(error => {
			if (error.response) {
				if (error.response.data.user) {
					this.errors = error.response.data.user;
				}

				this.globalErrors = error.response.data.non_field_errors || [];
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
	