<template>
	<div>
	<h2>Назначение премии</h2>
	<div v-if="isSuccess" class="alert alert-success" role="alert">
		Вы успешно назначили премию в размере {{ rewardSum }} единиц
	</div>
	<form @submit.prevent="submitForm">
		<div class="mb-3">
		<textarea
			v-model="form.comment"
			class="form-control"
			placeholder="Комментарий к премии"
			required
		></textarea>
		<div v-if="errors.comment" class="text-danger">
			<span>{{ errors.comment[0] }}</span>
		</div>
		</div>
		<button :disabled="!form.comment" @click.prevent="createReward" type="submit" class="btn btn-primary w-100">
		Назначить премию
		</button>
	</form>
	</div>
</template>

<script>
import axios from '../../utils/axiosConfig';

export default {
	data() {
	return {
		form: {
		comment: ''
		},
		errors: [],
		isSuccess: false,
		rewardSum: null,
	};
	},
	methods: {
	async createReward() {
		if (!this.form.comment) {
		this.errors.comment = ['Поле комментарий обязательно для заполнения.'];
		return;
		}

		try {
		const formData = {
			comment: this.form.comment,
		};

		const accessToken = localStorage.getItem('access_token');

		const headers = {
			Authorization: `Bearer ${accessToken}`,
		};

		const response = await axios.post(`${process.env.VUE_APP_API_URL}/rewards/${this.$route.params.id}/create/`, formData, {
			headers: headers,
		});

		this.isSuccess = true;
		this.rewardSum = response.data.reward.reward_sum;
		this.form.comment = '';
		this.errors.comment = [];

		} catch (error) {
		console.error('Ошибка при выполнении запросов:', error);
		if (error.response && error.response.data) {
			this.errors = error.response.data;
		}
		}
	}
	}
};
</script>

<style>
</style>
