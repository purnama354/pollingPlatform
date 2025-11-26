package models

import (
	"errors"
	"strings"
	"time"
	"unicode"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username     string `json:"username" binding:"required,min=3,max=30"`
	Email        string `json:"email" binding:"required,email"`
	Password     string `json:"password" binding:"required,min=6"`
	Role         string `json:"role" default:"user"`
	RefreshToken string `json:"-"`
}

type Poll struct {
	gorm.Model
	Title       string    `json:"title" binding:"required,min=3,max=100"`
	Description string    `json:"description" binding:"required,max=500"`
	EndDate     time.Time `json:"endDate" binding:"required"` // Remove 'future' tag
	Options     []Option  `json:"options" binding:"required,min=2,dive"`
}

type Option struct {
	gorm.Model
	PollID uint   `json:"pollId"`
	Text   string `json:"text" binding:"required,min=1,max=200"`
	Votes  int    `json:"votes"`
}

type Vote struct {
	gorm.Model
	PollID   uint `json:"pollId" binding:"required" gorm:"index:idx_user_poll,unique"`
	OptionID uint `json:"optionId" binding:"required"`
	UserID   uint `json:"userId" binding:"required" gorm:"index:idx_user_poll,unique"`
}

// ValidateUser validates user data before creation
func (u *User) ValidateUser() error {
	// Username validations
	username := strings.TrimSpace(u.Username)
	if username == "" {
		return errors.New("username cannot be empty")
	}
	if len(username) < 3 {
		return errors.New("username must be at least 3 characters")
	}
	if len(username) > 30 {
		return errors.New("username cannot exceed 30 characters")
	}
	if strings.ContainsAny(username, "<>{}[]@") {
		return errors.New("username contains invalid characters")
	}

	// Email validations
	email := strings.TrimSpace(u.Email)
	if email == "" {
		return errors.New("email cannot be empty")
	}
	if len(email) > 100 {
		return errors.New("email cannot exceed 100 characters")
	}
	// Basic email format validation
	if !strings.Contains(email, "@") || !strings.Contains(email, ".") {
		return errors.New("invalid email format")
	}

	// Password validations
	if len(u.Password) < 6 {
		return errors.New("password must be at least 6 characters")
	}
	if len(u.Password) > 72 {
		return errors.New("password cannot exceed 72 characters")
	}

	// Check password complexity
	hasUpper := false
	hasLower := false
	hasNumber := false
	for _, char := range u.Password {
		switch {
		case unicode.IsUpper(char):
			hasUpper = true
		case unicode.IsLower(char):
			hasLower = true
		case unicode.IsNumber(char):
			hasNumber = true
		}
	}

	if !hasUpper || !hasLower || !hasNumber {
		return errors.New("password must contain at least one uppercase letter, one lowercase letter, and one number")
	}

	// Role validation
	if u.Role == "" {
		u.Role = "user" // Set default role
	}
	if u.Role != "user" && u.Role != "admin" {
		return errors.New("invalid role")
	}

	return nil
}

// ValidatePoll validates a poll before creation
func (p *Poll) ValidatePoll() error {
	// Title validations
	title := strings.TrimSpace(p.Title)
	if title == "" {
		return errors.New("title cannot be empty")
	}
	if len(title) < 3 {
		return errors.New("title must be at least 3 characters long")
	}
	if len(title) > 100 {
		return errors.New("title cannot exceed 100 characters")
	}
	if strings.ContainsAny(title, "<>{}[]") {
		return errors.New("title contains invalid characters")
	}

	// Description validations
	desc := strings.TrimSpace(p.Description)
	if desc == "" {
		return errors.New("description cannot be empty")
	}
	if len(desc) > 500 {
		return errors.New("description cannot exceed 500 characters")
	}
	if strings.ContainsAny(desc, "<>{}[]") {
		return errors.New("description contains invalid characters")
	}

	// End date validations
	now := time.Now()
	if p.EndDate.Before(now) {
		return errors.New("end date must be in the future")
	}

	minDuration := time.Hour * 1 // Minimum 1 hour
	if p.EndDate.Sub(now) < minDuration {
		return errors.New("poll duration must be at least 1 hour")
	}

	maxDuration := time.Hour * 24 * 30 // Maximum 30 days
	if p.EndDate.Sub(now) > maxDuration {
		return errors.New("poll duration cannot exceed 30 days")
	}

	// Options validations
	if len(p.Options) < 2 {
		return errors.New("poll must have at least 2 options")
	}
	if len(p.Options) > 10 {
		return errors.New("poll cannot have more than 10 options")
	}

	// Check for duplicate options and validate each option
	optionMap := make(map[string]bool)
	for _, opt := range p.Options {
		text := strings.TrimSpace(opt.Text)
		if text == "" {
			return errors.New("option text cannot be empty")
		}
		if len(text) < 1 {
			return errors.New("option text must be at least 1 character")
		}
		if len(text) > 200 {
			return errors.New("option text cannot exceed 200 characters")
		}
		if strings.ContainsAny(text, "<>{}[]") {
			return errors.New("option text contains invalid characters")
		}
		if optionMap[strings.ToLower(text)] {
			return errors.New("duplicate options are not allowed (case-insensitive)")
		}
		optionMap[strings.ToLower(text)] = true

		// Validate initial votes
		if opt.Votes != 0 {
			return errors.New("new options must have 0 votes")
		}
	}

	return nil
}

func (p *Poll) IsActive() bool {
	return time.Now().Before(p.EndDate)
}

func (p *Poll) TimeRemaining() time.Duration {
	return time.Until(p.EndDate)
}

func (p *Poll) TotalVotes() int {
	total := 0
	for _, option := range p.Options {
		total += option.Votes
	}
	return total
}

// func (p *Poll) ValidatePoll() error {
//     // Title validations
//     title := strings.TrimSpace(p.Title)
//     if title == "" {
//         return errors.New("title cannot be empty")
//     }
//     if len(title) < 3 {
//         return errors.New("title must be at least 3 characters long")
//     }
//     if len(title) > 100 {
//         return errors.New("title cannot exceed 100 characters")
//     }
//     if strings.ContainsAny(title, "<>{}[]") {
//         return errors.New("title contains invalid characters")
//     }

//     // Description validations
//     desc := strings.TrimSpace(p.Description)
//     if desc == "" {
//         return errors.New("description cannot be empty")
//     }
//     if len(desc) > 500 {
//         return errors.New("description cannot exceed 500 characters")
//     }
//     if strings.ContainsAny(desc, "<>{}[]") {
//         return errors.New("description contains invalid characters")
//     }

//     // End date validations
//     now := time.Now()
//     if p.EndDate.Before(now) {
//         return errors.New("end date must be in the future")
//     }

//     minDuration := time.Hour * 1  // Minimum 1 hour
//     if p.EndDate.Sub(now) < minDuration {
//         return errors.New("poll duration must be at least 1 hour")
//     }

//     maxDuration := time.Hour * 24 * 30 // Maximum 30 days
//     if p.EndDate.Sub(now) > maxDuration {
//         return errors.New("poll duration cannot exceed 30 days")
//     }

//     // Options validations
//     if len(p.Options) < 2 {
//         return errors.New("poll must have at least 2 options")
//     }
//     if len(p.Options) > 10 {
//         return errors.New("poll cannot have more than 10 options")
//     }

//     // Check for duplicate options and validate each option
//     optionMap := make(map[string]bool)
//     for _, opt := range p.Options {
//         text := strings.TrimSpace(opt.Text)
//         if text == "" {
//             return errors.New("option text cannot be empty")
//         }
//         if len(text) < 1 {
//             return errors.New("option text must be at least 1 character")
//         }
//         if len(text) > 200 {
//             return errors.New("option text cannot exceed 200 characters")
//         }
//         if strings.ContainsAny(text, "<>{}[]") {
//             return errors.New("option text contains invalid characters")
//         }
//         if optionMap[strings.ToLower(text)] {
//             return errors.New("duplicate options are not allowed (case-insensitive)")
//         }
//         optionMap[strings.ToLower(text)] = true

//         // Validate initial votes
//         if opt.Votes != 0 {
//             return errors.New("new options must have 0 votes")
//         }
//     }

//     return nil
// }
