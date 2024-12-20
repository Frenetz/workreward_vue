<template>
	<div>
	<h2>Создание задачи</h2>
	<div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
		{{ successMessage }}
	</div>	
	<form @submit.prevent="submitForm">
		<div class="mb-3">
		<input
			type="text"
			v-model="form.title"
			class="form-control"
			placeholder="Название"
		/>
		<div v-if="errors.task?.title" class="text-danger">
			<span>{{ errors.task.title[0] }}</span>
		</div>
		</div>

		<div class="mb-3">
		<input
			type="text"
			v-model="form.description"
			class="form-control"
			placeholder="Описание"
		/>
		<div v-if="errors.description" class="text-danger">
			<span>{{ errors.description[0] }}</span>
		</div>
		</div>

		<div class="mb-3">
		<input
			type="text"
			v-model="form.difficulty"
			class="form-control"
			placeholder="Сложность (от 1 до 5)"
		/>
		<div v-if="errors.difficulty" class="text-danger">
			<span>{{ errors.difficulty[0] }}</span>
		</div>
		</div>

		<div class="mb-3">
		<input
			type="text"
			v-model="form.task_duration"
			class="form-control"
			placeholder="Примерное время выполнения (в формате ЧЧ:ММ:СС)"
		/>
		<div v-if="errors.task_duration" class="text-danger">
			<span>{{ errors.task_duration[0] }}</span>
		</div>
		</div>

		<div class="mb-3">
		<h4>Выберите исполнителя (если необходимо)</h4>
		<div v-if="filteredUsers.length > 0" class="row">
			<div
				class="col-md-4 mb-3"
				v-for="user in filteredUsers"
				:key="user.id"
				:class="{'card-selected': form.task_performer === user.id}"
			>
				<div
				class="card"
				@click="selectUser(user.id)"
				>
				<div class="card-body">
					<p class="card-text">{{ user.first_name }} {{ user.last_name }}</p>
				</div>
				</div>
			</div>
		</div>
		<div v-else>
			<p>Пользователи не найдены.</p>
		</div>
		</div>

		<div v-if="usersData.previous || usersData.next" class="pagination mb-5">
		<button
			v-if="usersData.previous"
			@click.prevent="fetchUsers(usersData.previous)"
			class="btn btn-secondary"
		>
			Предыдущая
		</button>
		<button
			v-if="usersData.next"
			@click.prevent="fetchUsers(usersData.next)"
			class="btn btn-secondary"
		>
			Следующая
		</button>
		</div>

		<div class="text-center">
		<button type="submit" class="btn btn-primary w-100">
			Создать задачу
		</button>
		</div>
	</form>
	</div>
</template>

<script>
import axios from '../../utils/axiosConfig';

export default {
	data() {
	return {
		form: {
			title: '',
			description: '',
			difficulty: '',
			task_duration: '',
			task_performer: '',
		},
		successMessage: '',
		errors: {},
		usersData: {
			results: [],
			next: null,
			previous: null,
		},
	};
	},
	methods: {
	async submitForm() {
		const formData = {
		title: this.form.title,
		description: this.form.description,
		difficulty: this.form.difficulty,
		task_duration: this.form.task_duration,
		};
		if (this.form.task_performer !== ''){
			formData['task_performer'] = this.form.task_performer;
		}
		const accessToken = localStorage.getItem('access_token');
		const headers = {
			Authorization: `Bearer ${accessToken}`,
		};

		try {
		await axios.post(`${process.env.VUE_APP_API_URL}/tasks/create/`, formData, {
			headers: headers,
		});
		this.form.title = '';
		this.form.description = '';
		this.form.difficulty = '';
		this.form.task_duration = '';
		this.form.task_performer = '';
		this.successMessage = 'Задача успешно создана!';
		} catch (error) {
		if (error.response) {
			if (error.response.data.task) {
			this.errors = error.response.data.task;
			}
			if (error.response.data.detail) {
			this.globalErrors = error.response.data.detail;
			}
		} else {
			alert('Ошибка сети или сервера.');
		}
		}
	},
	async fetchUsers(url = `${process.env.VUE_APP_API_URL}/users/list/`) {
		try {
		const accessToken = localStorage.getItem('access_token');
		const headers = {
			Authorization: `Bearer ${accessToken}`,
		};
		const response = await axios.get(url, { headers });
		this.usersData = response.data.user;
		} catch (error) {
		console.error('Ошибка при загрузке пользователей:', error);
		}
	},
	selectUser(userId) {
		this.form.task_performer = userId;
	},
	},
	mounted() {
	this.fetchUsers();
	},
	computed: {
	filteredUsers() {
		return this.usersData.results.filter(user => !user.is_manager);
  }
}	
};
</script>

<style scoped>
.card {
	cursor: pointer;
}
.card-title {
	font-size: 1.25rem;
}
.card-text {
	font-size: 1rem;
}
.row {
	display: flex;
	flex-wrap: wrap;
}
.col-md-4 {
	padding: 10px;
}
.pagination {
	margin-top: 15px;
}
.card-selected {
	border: 2px solid #007bff;
	background-color: #e9f5ff;
}
</style>
