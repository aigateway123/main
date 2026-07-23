package entity

type ServiceHealth struct {
	Service string `json:"service"`
	Status  string `json:"status"`
	Env     string `json:"env"`
}
