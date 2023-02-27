variable "GITHUB_REF_NAME" {
	default = "main"
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
		notequal("main", GITHUB_REF_NAME) ? "${name}:${regex_replace(
		  GITHUB_REF_NAME,
		  "^v",
		  ""
		)}" : "",
		notequal("", GITHUB_SHA) ? "${name}:${GITHUB_SHA}" : "",
	]
}

variable "NODE_VERSION" { default = "18.14.2" }

variable "NGINX_VERSION" { default = "1.23.3" }

function "args" {
	params = []
	result = {
		NODE_VERSION    = NODE_VERSION
		NGINX_VERSION   = NGINX_VERSION
		GITHUB_REF_NAME = GITHUB_REF_NAME
		GITHUB_SHA      = GITHUB_SHA
	}
}

group "default" {
	targets = [
		"static",
		"nginx",
		"server",
	]
}

target "static" {
	target = "static"
	labels = labels()
	tags   = tags("harrybrwn/harrybrwn.github.io")
	args   = args()
}

target "nginx" {
	target = "nginx"
	labels = labels()
	tags   = tags("harrybrwn/harrybrwn.github.io-nginx")
	args   = args()
}

target "server" {
	target = "server"
	labels = labels()
	tags   = tags("harrybrwn/harrybrwn.github.io-server")
	args   = args()
}