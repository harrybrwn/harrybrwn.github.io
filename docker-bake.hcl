variable "GITHUB_REF_NAME" {
	default = "latest"
}

variable "GITHUB_SHA" {
	default = ""
}

variable "GIT_BRANCH" {
    default = "dev"
}

function "labels" {
    params = []
    result = {
        "git.commit" = "${GITHUB_SHA}"
        "git.branch" = "${GIT_BRANCH}"
        "version"    = "${GITHUB_REF_NAME}"
    }
}

function "tags" {
	params = [name]
	result = [
		"${name}:latest",
		notequal("", GITHUB_REF_NAME) ? "${name}:${GITHUB_REF_NAME}" : "",
		notequal("", GITHUB_SHA) ? "${name}:${GITHUB_SHA}" : "",
	]
}

group "default" {
	targets = [
		"static"
	]
}

variable "NODE_VERSION" {
	default = "18.12.1-alpine"
}

variable "NGINX_VERSION" {
	default = "1.23.3-alpine"
}

target "static" {
	target = "static"
	labels = labels()
	tags   = tags("harrybrwn/harrybrwn.github.io")
	args   = {
		NODE_VERSION = NODE_VERSION
	}
}

target "nginx" {
	target = "nginx"
	labels = labels()
	tags   = tags("harrybrwn/harrybrwn.github.io-nginx")
	args   = {
		NODE_VERSION  = NODE_VERSION
		NGINX_VERSION = NGINX_VERSION
	}
}