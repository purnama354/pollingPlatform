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

	// Debug logging middleware
	r.Use(func(c *gin.Context) {
		println("Incoming request:", c.Request.Method, c.Request.URL.Path, "Origin:", c.Request.Header.Get("Origin"))
		c.Next()
	})

	// Configure CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://127.0.0.1:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"},
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

		// Public poll routes (no authentication required)
		api.GET("/polls", pollHandler.ListPolls)
		api.GET("/polls/:id", pollHandler.GetPoll)

		// Protected routes
		authenticated := api.Group("/")
		authenticated.Use(middleware.AuthMiddleware())
		{
			authenticated.GET("/me", authHandler.GetMe)

			// Rate limiters
			pollCreationLimiter := middleware.NewRateLimiter(10, time.Hour) // 10 polls per hour
			voteLimiter := middleware.NewRateLimiter(100, time.Minute)      // 100 votes per minute

			// Protected poll routes (authentication required)
			authenticated.POST("/polls", pollCreationLimiter.Middleware(), pollHandler.CreatePoll)
			authenticated.POST("/polls/:id/vote", voteLimiter.Middleware(), pollHandler.Vote)
		}
	}

	r.Run(":8080")
}
