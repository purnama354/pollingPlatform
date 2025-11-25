package main

import (
	db "pollingPlatform/DB"
	"pollingPlatform/handlers"
	"pollingPlatform/middleware"
	"pollingPlatform/repository"
	"time"

	"github.com/gin-contrib/cors"
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

	// Configure CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

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
				polls.POST("/:id/vote", pollHandler.Vote)
			}
		}
	}

	r.Run(":8080")
}
