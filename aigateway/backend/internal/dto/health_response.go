package dto

type HealthResponse struct {
	Code    int            `json:"code"`
	Message string         `json:"message"`
	Data    HealthResponseData `json:"data"`
}

type HealthResponseData struct {
	Service string `json:"service"`
	Status  string `json:"status"`
	Env     string `json:"env"`
}
