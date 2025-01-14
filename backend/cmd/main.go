package main

import (
	db "pollingPlatform/DB"
	"pollingPlatform/handlers"
	"pollingPlatform/middleware"
	"pollingPlatform/repository"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
)

func main() {
	// Initialize database
	db.InitDB()

	// Initialize repositories
	userRepo := repository.NewUserRepository(db.GetDB())
	pollRepo := repository.NewPollRepository(db.GetDB())

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(userRepo)
	pollHandler := handlers.NewPollHandler(pollRepo)

	// Initialize Gin
	r := gin.Default()

	// Add custom validator for future dates
	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterValidation("future", func(fl validator.FieldLevel) bool {
			date, ok := fl.Field().Interface().(time.Time)
			if !ok {
				return false
			}
			return date.After(time.Now())
		})
	}

	// Routes
	api := r.Group("/api")
	{
		// Auth routes
		api.POST("/register", authHandler.Register)
		api.POST("/login", authHandler.Login)
		api.POST("/refresh-token", authHandler.RefreshToken)

		// Protected routes
		authenticated := api.Group("/")
		authenticated.Use(middleware.AuthMiddleware())
		{
			api.GET("/me", authHandler.GetMe)
			polls := authenticated.Group("/polls")
			{
				polls.POST("/", pollHandler.CreatePoll)
				polls.GET("/:id", pollHandler.GetPoll)
				polls.GET("/", pollHandler.ListPolls)
			}
		}
	}

	r.Run(":8080")
}
