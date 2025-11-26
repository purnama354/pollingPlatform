package handlers

import (
	"net/http"
	"pollingPlatform/models"
	"pollingPlatform/repository"
	"strconv"

	"github.com/gin-gonic/gin"
)

type PollHandler struct {
	repo *repository.PollRepository
}

func NewPollHandler(repo *repository.PollRepository) *PollHandler {
	return &PollHandler{repo: repo}
}

func (h *PollHandler) CreatePoll(c *gin.Context) {
	var poll models.Poll
	if err := c.ShouldBindJSON(&poll); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"error":   "Invalid request format",
			"details": err.Error(),
		})
		return
	}

	// Validate poll
	if err := poll.ValidatePoll(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"error":   "Validation failed",
			"details": err.Error(),
		})
		return
	}

	// Initialize votes to 0
	for i := range poll.Options {
		poll.Options[i].Votes = 0
	}

	// Create poll
	if err := h.repo.CreatePoll(&poll); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"error":   "Failed to create poll",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status":  "success",
		"message": "Poll created successfully",
		"data":    poll,
	})
}

func (h *PollHandler) GetPoll(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	poll, err := h.repo.GetPollByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Poll not found"})
		return
	}

	c.JSON(http.StatusOK, poll)
}

func (h *PollHandler) ListPolls(c *gin.Context) {
	// Parse pagination parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	status := c.DefaultQuery("status", "all") // all, active, ended

	// Validate pagination parameters
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 50 {
		limit = 10
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get total count and polls
	polls, total, err := h.repo.ListPolls(offset, limit, status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch polls",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"polls": polls,
		"pagination": gin.H{
			"current_page": page,
			"per_page":     limit,
			"total_items":  total,
			"total_pages":  (total + int64(limit) - 1) / int64(limit),
		},
	})
}

func (h *PollHandler) Vote(c *gin.Context) {
	// Get authenticated user ID from context (set by auth middleware)
	userIDInterface, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status": "error",
			"error":  "User not authenticated",
		})
		return
	}

	userID, ok := userIDInterface.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "error",
			"error":  "Invalid user ID format",
		})
		return
	}

	var vote struct {
		OptionIndex int `json:"option_index" binding:"required"`
	}

	if err := c.ShouldBindJSON(&vote); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"error":   "Invalid request format",
			"details": err.Error(),
		})
		return
	}

	pollID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "error",
			"error":  "Invalid poll ID",
		})
		return
	}

	// Check if poll exists and is active
	poll, err := h.repo.GetPollByID(uint(pollID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"status": "error",
			"error":  "Poll not found",
		})
		return
	}

	if !poll.IsActive() {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "error",
			"error":  "Poll has ended",
		})
		return
	}

	// Validate option index
	if vote.OptionIndex < 0 || vote.OptionIndex >= len(poll.Options) {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "error",
			"error":  "Invalid option index",
		})
		return
	}

	optionID := poll.Options[vote.OptionIndex].ID

	// Check if user has already voted
	hasVoted, err := h.repo.HasUserVoted(uint(pollID), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "error",
			"error":  "Failed to check voting status",
		})
		return
	}
	if hasVoted {
		c.JSON(http.StatusConflict, gin.H{
			"status": "error",
			"error":  "You have already voted on this poll",
		})
		return
	}

	// Record vote with user ID
	err = h.repo.RecordVote(uint(pollID), optionID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"error":   "Failed to record vote",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Vote recorded successfully",
	})
}
