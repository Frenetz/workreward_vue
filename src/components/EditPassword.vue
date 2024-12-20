<template>
	<h2>Изменение пароля</h2>
	<div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
		{{ successMessage }}
	</div>
	<form @submit.prevent="submitForm">
		<div class="mb-3">
			<input
			type="password"
			v-model="form.old_password"
			class="form-control"
			placeholder="Старый пароль"
			required
			/>
			<div v-if="errors.old_password" class="text-danger">
				<span>{{ errors.old_password[0] }}</span>
			</div>
		</div>

		<div class="mb-3">
			<input
			type="password"
			v-model="form.new_password1"
			class="form-control"
			placeholder="Новый пароль"
			required
			/>
			<div v-if="errors.new_password1" class="text-danger">
				<span>{{ errors.new_password1[0] }}</span>
			</div>
		</div>

		<div class="mb-3">
			<input
			type="password"
			v-model="form.new_password2"
			class="form-control"
			placeholder="Повторите пароль"
			required
			/>
			<div v-if="errors.new_password2" class="text-danger">
				<span>{{ errors.new_password2[0] }}</span>
			</div>
		</div>

		<div class="text-center">
			<button type="submit" class="btn btn-primary w-100" :disabled="!isFormValid">
				Изменить пароль
			</button>
		</div>
	</form>
</template>

<script>
import axios from '../../utils/axiosConfig';
export default {
	data() {
		return {
			form: {
				old_password: '',
				new_password1: '',
				new_password2: '',
			},
			successMessage: '',
			errors: {},
			globalErrors: [],
		}
	},
	computed: {
		isFormValid() {
			return this.form.old_password && this.form.new_password1 && this.form.new_password2;
		}
	},
	methods: {
		async submitForm() {
			const formData = {
				old_password: this.form.old_password,
				new_password1: this.form.new_password1,
				new_password2: this.form.new_password2
			};

			const accessToken = localStorage.getItem('access_token');
			const headers = {
				Authorization: `Bearer ${accessToken}`,
			};

			await axios.post(`${process.env.VUE_APP_API_URL}/users/password-change/`, formData, {
				headers: headers
			})
			.then(() => {
				this.form.old_password = '';
				this.form.new_password1 = '';
				this.form.new_password2 = '';
				this.successMessage = 'Пароль был успешно обновлен'
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
	}
}
</script>

<style>

</style>
