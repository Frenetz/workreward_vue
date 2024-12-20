<template>
	<h2>Информация о вашем профиле</h2>
	<p><strong>Username: </strong>{{ this.username }}</p>
	<p><strong>Email: </strong>{{ this.email }}</p>
	<p><strong>Имя: </strong>{{ this.first_name }}</p>
	<p><strong>Фамилия: </strong>{{ this.last_name }}</p>
	<p><strong>Отчество: </strong>{{ this.patronymic }}</p>
	<p><strong>Статус: </strong>{{ this.status }}</p>
	<div class="nav-links">
		<router-link class="btn btn-primary" to="/edit-profile">Изменить данные</router-link>
		<router-link class="btn btn-primary" to="/edit-password">Изменить пароль</router-link>
	</div>
</template>

<script>
import axios from '../../utils/axiosConfig';
export default {
	data() {
		return {
			profileData: null,
			username: '',
			email: '',
			first_name: '',
			last_name: '',
			patronymic: '',
			status: ''

		}
	},
	methods: {
		async fetchProfile() {
			try {
				const accessToken = localStorage.getItem('access_token');

				const headers = {
				Authorization: `Bearer ${accessToken}`,
				};

				const response = await axios.get(`${process.env.VUE_APP_API_URL}/users/profile/`, {
					headers: headers,
				});

				this.profileData = response.data.user;

				this.username = this.profileData.username;
				this.email = this.profileData.email;
				this.first_name = this.profileData.first_name;
				this.last_name = this.profileData.last_name;
				this.patronymic = this.profileData.patronymic;
			} catch (error) {
				console.error('Ошибка при загрузке профиля:', error);
			}
		},
		setStatus() {
			if (localStorage.getItem('is_manager') === 'true') {
				this.status = "Менеджер";
			}
			else {
				this.status = "Исполнитель";
			}
		}
	},
	mounted() {
		this.fetchProfile();
		this.setStatus();
	},
}
</script>

<style scoped>
.nav-links {
	display: flex;
	gap: 10px;
}
</style>
