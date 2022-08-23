import { success, failure} from '../helpers/response.js';
import restify from 'restify';

let users = {
	1: {
		'id': 1,
		'firstName': 'Maya',
		'lastName': 'Douglas',
		'email': 'mayacdouglas@gmail.com'
	}
	
};
let max_user_id = 1;

const userController = (server) => {
	server.pre(restify.plugins.pre.dedupeSlashes());
	server.get('/', (req, res, next) => {
		success(res, next, users);
	});

	server.get('/user/:id', (req, res, next) => {
		req.assert('id', 'Id paramater is required and must be numeric.').notEmpty().isInt();
		const errors = req.validationErrors();
		if (errors) {
			failure(res, next, 400, errors[0]);
		}
		if (typeof(users[req.params.id]) === 'undefined') {
			failure(res, next, 404, 'User not found')
		}
		success(res, next, users[parseInt(req.params.id)])
	});

	server.post('/user', (req, res, next) => {
		req.assert('firstName', 'firstName paramater is required.').notEmpty();
		req.assert('lastName', 'lastName paramater is required.').notEmpty();
		req.assert('email', 'email paramater is required and must be a valid email address.').notEmpty().isEmail();
		const errors = req.validationErrors();
		if (errors) {
			failure(res, next, 400, errors[0]);
		}
		let user = req.params;
		max_user_id++;
		user.id = max_user_id;
		users[user.id] = user;
		success(res, next, user);
	});

	server.put('/user/:id', (req, res, next) => {
		req.assert('id', 'Id paramater is required and must be numeric.').notEmpty().isInt();
		const errors = req.validationErrors();
		if (errors) {
			failure(res, next, 400, errors[0]);
		}
		if (typeof(users[req.params.id]) === 'undefined') {
			failure(res, next, 404, 'User not found')
		}
		let user = users[parseInt(req.params.id)];
		let updates = req.params;
		for (let attr in updates) {
			user[attr] = updates[attr];
		}
		success(res, next, user);
	});

	server.del('/user/:id', (req, res, next) => {
		req.assert('id', 'Id paramater is required and must be numeric.').notEmpty().isInt();
		const errors = req.validationErrors();
		if (errors) {
			failure(res, next, 400, errors[0]);
		}
		if (typeof(users[req.params.id]) === 'undefined') {
			failure(res, next, 404, 'User not found')
		}
		const data = delete users[parseInt(req.params.id)];
		success(res, next, data);
	});
}

export default userController;