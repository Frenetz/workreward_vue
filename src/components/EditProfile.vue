<template>
	<h2>Изменение данных профиля</h2>
	<div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
		{{ successMessage }}
	</div>
	<form @submit.prevent="submitForm">
		<div class="mb-3">
			<input
			type="text"
			v-model="form.first_name"
			class="form-control"
			placeholder="Имя"
			/>
			<div v-if="errors.first_name" class="text-danger">
				<span>{{ errors.first_name[0] }}</span>
			</div>
		</div>

		<div class="mb-3">
			<input
			type="text"
			v-model="form.last_name"
			class="form-control"
			placeholder="Фамилия"
			/>
			<div v-if="errors.last_name" class="text-danger">
				<span>{{ errors.last_name[0] }}</span>
			</div>
		</div>

		<div class="mb-3">
			<input
			type="text"
			v-model="form.patronymic"
			class="form-control"
			placeholder="Отчество"
			/>
			<div v-if="errors.patronymic" class="text-danger">
				<span>{{ errors.patronymic[0] }}</span>
			</div>
		</div>


		<div class="text-center">
			<button type="submit" class="btn btn-primary w-100" :disabled="isFormEmpty">
				Изменить данные
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
				first_name: '',
				last_name: '',
				patronymic: '',
			},
			successMessage: '',
			errors: {},
			globalErrors: [],
		}
	},
	computed: {
		isFormEmpty() {
			return !this.form.first_name && !this.form.last_name && !this.form.patronymic;
		}
	},
	methods: {
		async submitForm() {
			const formData = {};
			if (this.form.first_name !== '') {
				formData['first_name'] = this.form.first_name;
			}

			if (this.form.last_name !== '') {
				formData['last_name'] = this.form.last_name;
			}

			if (this.form.patronymic !== '') {
				formData['patronymic'] = this.form.patronymic;
			}

			const accessToken = localStorage.getItem('access_token');
			const headers = {
				Authorization: `Bearer ${accessToken}`,
			};

			await axios.patch(`${process.env.VUE_APP_API_URL}/users/profile/`, formData, {
				headers: headers
			})
			.then(() => {
				this.form.first_name = '';
				this.form.last_name = '';
				this.form.patronymic = '';
				this.successMessage = 'Профиль был успешно обновлен'
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