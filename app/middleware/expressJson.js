const express = require('express')
const config = require('../manager/config')

module.exports = {
	sync() {
		config.getApp().use(express.json())
	}
}