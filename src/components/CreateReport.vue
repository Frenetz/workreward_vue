<template>
	<div>
	<h2>Отчет для задачи №{{ this.$route.params.id }}</h2>
	<div v-if="!isSuccess">
		<div class="alert alert-info" role="alert">
		Напишите отчет, чтобы закрыть задачу.
		</div>
		<form @submit.prevent="submitForm">
		<div class="mb-3">
			<textarea
			v-model="form.text"
			class="form-control"
			placeholder="Текст отчета"
			required
			></textarea>
			<div v-if="errors.text" class="text-danger">
			<span>{{ errors.text[0] }}</span>
			</div>
		</div>
		<button type="submit" class="btn btn-primary w-100">
			Отправить отчет
		</button>
		</form>
	</div>
	<div v-else class="alert alert-success" role="alert">
		Задача успешно закрыта!
	</div>
	</div>
</template>

<script>
import axios from '../../utils/axiosConfig';

export default {
	data() {
	return {
		form: {
		text: ''
		},
		errors: [],
		isSuccess: false,
	};
	},
	methods: {
	async submitForm() {
		try {
		const formData = {
			text: this.form.text
		};

		const accessToken = localStorage.getItem('access_token');

		const headers = {
			Authorization: `Bearer ${accessToken}`,
		};

		await axios.patch(`${process.env.VUE_APP_API_URL}/tasks/list/${this.$route.params.id}/complete/`, {}, {
			headers: headers,
		});

		await axios.post(`${process.env.VUE_APP_API_URL}/reports/${this.$route.params.id}/create/`, formData, {
			headers: headers,
		});

		this.isSuccess = true;

		} catch (error) {
		console.error('Ошибка при выполнении запросов:', error);
		}
	}
	}
};
</script>

<style>
</style>
