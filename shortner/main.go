package main

import (
    "fmt"
    "log"
    "os"
    "net/http"

    "github.com/gin-gonic/gin"
    "github.com/dgrijalva/jwt-go"
    "github.com/joho/godotenv"
)


type UrlMap struct {
    ID             string `json:"id"`
    OriginalUrl    string `json:"originalurl"`
    ShortCode      string `json:"shortcode"`
    UserID         string `json:"userid"`
    CreatedAt      string `json:"createdat"`
    ExpirationDate string `json:"expirationdate"`
}

var urlmaps = []UrlMap{
    // Sample data
}


func main() {
    // Load .env file
    err := godotenv.Load()
    if err != nil {
        log.Fatalf("Error loading .env file")
    }

    // Get JWT secret key from .env file
    jwtSecret := os.Getenv("JWT_SECRET")

    router := gin.Default()
    router.GET("/urlmaps", func(c *gin.Context) {
        // Example: validate JWT here
        tokenString := c.GetHeader("Authorization")
        _, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
            // Validate token method
            if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
                return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
            }
            return []byte(jwtSecret), nil
        })
        if err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
            return
        }

        // Handle your request logic
        c.JSON(http.StatusOK, urlmaps)
    })

    router.POST("/urlmaps", func(c *gin.Context) {
        tokenString := c.GetHeader("Authorization")
        _, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
            // Validate token method
            if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
                return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
            }
            return []byte(jwtSecret), nil
        })
        if err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
            return
        }

        var urlmap UrlMap
        if err := c.BindJSON(&urlmap); err != nil {
            return
        }
        urlmaps = append(urlmaps, urlmap)
    })

    router.Run(":8080")
}




