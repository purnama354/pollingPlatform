package db

import (
	"fmt"
	"log"
	"os"

	"pollingPlatform/models"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	var err error

	// Load environment variables from .env file
	err = godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dbHost := os.Getenv("DB_HOST")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbPort := os.Getenv("DB_PORT")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		dbHost, dbUser, dbPassword, dbName, dbPort)

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
		os.Exit(1)
	}

	// Auto Migrate the models
	// Auto Migrate the models
	err = DB.AutoMigrate(&models.User{}, &models.Poll{}, &models.Option{}, &models.Vote{})
	if err != nil {
		log.Fatal("Failed to migrate database: ", err)
		os.Exit(1)
	}

	log.Println("Database connected and migrated successfully!")
}

// GetDB returns the database instance
func GetDB() *gorm.DB {
	return DB
}
