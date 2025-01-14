package repository

import (
	"pollingPlatform/models"
	"time"

	"gorm.io/gorm"
)

type PollRepository struct {
	db *gorm.DB
}

func NewPollRepository(db *gorm.DB) *PollRepository {
	return &PollRepository{db: db}
}

func (r *PollRepository) CreatePoll(poll *models.Poll) error {
	return r.db.Create(poll).Error
}

func (r *PollRepository) GetPollByID(id uint) (*models.Poll, error) {
	var poll models.Poll
	err := r.db.Preload("Options").First(&poll, id).Error
	return &poll, err
}

func (r *PollRepository) ListPolls(offset, limit int, status string) ([]models.Poll, int64, error) {
	var polls []models.Poll
	var total int64
	query := r.db.Model(&models.Poll{})

	// Apply status filter
	now := time.Now()
	switch status {
	case "active":
		query = query.Where("end_date > ?", now)
	case "ended":
		query = query.Where("end_date <= ?", now)
	}

	// Get total count
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results
	err := query.
		Preload("Options").
		Order("created_at DESC").
		Offset(offset).
		Limit(limit).
		Find(&polls).Error

	return polls, total, err
}
