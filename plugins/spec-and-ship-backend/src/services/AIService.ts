import { GoogleGenerativeAI } from '@google/generative-ai';

const OPENAPI_PROMPT_TEMPLATE = `Kamu adalah AI architect yang ahli dalam membuat OpenAPI 3.0 specification.

Tugas: Buat OpenAPI 3.0 specification lengkap dalam format YAML berdasarkan deskripsi berikut:

"{prompt}"

Requirements:
1. Gunakan OpenAPI 3.0.0 format
2. Tambahkan info section dengan title, description, dan version
3. Tambahkan servers section
4. Buat paths untuk semua endpoint yang disebutkan
5. Untuk setiap endpoint, tambahkan:
   - summary dan description
   - parameters (query, path) jika diperlukan
   - requestBody dengan schema jika POST/PUT
   - responses (200, 400, 404, 500)
   - tags untuk grouping
6. Tambahkan components/schemas untuk semua data models
7. Tambahkan security schemes (Bearer token)
8. Tambahkan common parameters seperti pagination (limit, offset)
9. Tambahkan header X-Correlation-ID di semua endpoint

Output HANYA YAML, tanpa penjelasan tambahan. Mulai dengan "openapi: 3.0.0"`;

export class AIService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ 
            model: 'gemini-pro',
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
            }
        });
    }

    async generate(prompt: string): Promise<string> {
        try {
            const enhancedPrompt = OPENAPI_PROMPT_TEMPLATE.replace('{prompt}', prompt);
            const result = await this.model.generateContent(enhancedPrompt);
            const response = await result.response;
            let text = response.text();
            
            // Clean up response - remove markdown code blocks if present
            text = text.replace(/```yaml\n?/g, '').replace(/```\n?/g, '').trim();
            
            return text;
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            // Fallback to dummy OpenAPI spec
            return this.generateDummySpec(prompt);
        }
    }

    private generateDummySpec(prompt: string): string {
        // Extract service name from prompt (simple heuristic)
        const serviceName = this.extractServiceName(prompt);
        
        return `openapi: 3.0.0
info:
  title: ${serviceName} API
  description: |
    API specification for ${serviceName}.
    
    **Note:** This is a demo specification generated as fallback.
    For production use, please configure a valid Gemini API key.
    
    Original request: "${prompt.substring(0, 100)}..."
  version: 1.0.0
  contact:
    name: API Support
    email: support@example.com

servers:
  - url: https://api.example.com/v1
    description: Production server
  - url: https://staging-api.example.com/v1
    description: Staging server

security:
  - BearerAuth: []

paths:
  /items:
    get:
      summary: List all items
      description: Retrieve a paginated list of items
      tags:
        - Items
      parameters:
        - name: limit
          in: query
          description: Maximum number of items to return
          schema:
            type: integer
            default: 20
            minimum: 1
            maximum: 100
        - name: offset
          in: query
          description: Number of items to skip
          schema:
            type: integer
            default: 0
            minimum: 0
        - name: X-Correlation-ID
          in: header
          description: Unique request identifier for tracing
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Item'
                  pagination:
                    $ref: '#/components/schemas/Pagination'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '500':
          $ref: '#/components/responses/InternalError'
    
    post:
      summary: Create a new item
      description: Create a new item in the system
      tags:
        - Items
      parameters:
        - name: X-Correlation-ID
          in: header
          description: Unique request identifier for tracing
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ItemInput'
      responses:
        '201':
          description: Item created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Item'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '500':
          $ref: '#/components/responses/InternalError'

  /items/{id}:
    get:
      summary: Get item by ID
      description: Retrieve a specific item by its ID
      tags:
        - Items
      parameters:
        - name: id
          in: path
          required: true
          description: Item ID
          schema:
            type: string
            format: uuid
        - name: X-Correlation-ID
          in: header
          description: Unique request identifier for tracing
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Item'
        '404':
          $ref: '#/components/responses/NotFound'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '500':
          $ref: '#/components/responses/InternalError'
    
    put:
      summary: Update item
      description: Update an existing item
      tags:
        - Items
      parameters:
        - name: id
          in: path
          required: true
          description: Item ID
          schema:
            type: string
            format: uuid
        - name: X-Correlation-ID
          in: header
          description: Unique request identifier for tracing
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ItemInput'
      responses:
        '200':
          description: Item updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Item'
        '404':
          $ref: '#/components/responses/NotFound'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '500':
          $ref: '#/components/responses/InternalError'
    
    delete:
      summary: Delete item
      description: Delete an item from the system
      tags:
        - Items
      parameters:
        - name: id
          in: path
          required: true
          description: Item ID
          schema:
            type: string
            format: uuid
        - name: X-Correlation-ID
          in: header
          description: Unique request identifier for tracing
          schema:
            type: string
            format: uuid
      responses:
        '204':
          description: Item deleted successfully
        '404':
          $ref: '#/components/responses/NotFound'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '500':
          $ref: '#/components/responses/InternalError'

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT token for authentication

  schemas:
    Item:
      type: object
      required:
        - id
        - name
        - createdAt
      properties:
        id:
          type: string
          format: uuid
          description: Unique identifier
          example: "123e4567-e89b-12d3-a456-426614174000"
        name:
          type: string
          description: Item name
          example: "Sample Item"
        description:
          type: string
          description: Item description
          example: "This is a sample item"
        status:
          type: string
          enum: [active, inactive, pending]
          description: Item status
          example: "active"
        createdAt:
          type: string
          format: date-time
          description: Creation timestamp
          example: "2024-01-01T00:00:00Z"
        updatedAt:
          type: string
          format: date-time
          description: Last update timestamp
          example: "2024-01-01T00:00:00Z"

    ItemInput:
      type: object
      required:
        - name
      properties:
        name:
          type: string
          description: Item name
          minLength: 1
          maxLength: 255
          example: "New Item"
        description:
          type: string
          description: Item description
          maxLength: 1000
          example: "Description of the new item"
        status:
          type: string
          enum: [active, inactive, pending]
          description: Item status
          default: "active"

    Pagination:
      type: object
      properties:
        total:
          type: integer
          description: Total number of items
          example: 100
        limit:
          type: integer
          description: Items per page
          example: 20
        offset:
          type: integer
          description: Number of items skipped
          example: 0
        hasMore:
          type: boolean
          description: Whether more items are available
          example: true

    Error:
      type: object
      required:
        - code
        - message
      properties:
        code:
          type: string
          description: Error code
          example: "INVALID_REQUEST"
        message:
          type: string
          description: Error message
          example: "The request is invalid"
        details:
          type: array
          items:
            type: object
            properties:
              field:
                type: string
              message:
                type: string

  responses:
    BadRequest:
      description: Bad request
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    
    Unauthorized:
      description: Unauthorized
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    
    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    
    InternalError:
      description: Internal server error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'`;
    }

    private extractServiceName(prompt: string): string {
        // Simple extraction - look for common patterns
        const patterns = [
            /service (?:untuk |for )?([^.]+)/i,
            /API (?:untuk |for )?([^.]+)/i,
            /sistem ([^.]+)/i,
            /([A-Z][a-z]+(?: [A-Z][a-z]+)*) (?:service|API|system)/i,
        ];

        for (const pattern of patterns) {
            const match = prompt.match(pattern);
            if (match && match[1]) {
                return match[1].trim();
            }
        }

        return 'Demo Service';
    }

    async refine(currentSpec: string, refinementPrompt: string): Promise<string> {
        try {
            const prompt = `Kamu adalah AI architect. Berikut adalah OpenAPI specification yang sudah ada:

\`\`\`yaml
${currentSpec}
\`\`\`

User meminta perubahan: "${refinementPrompt}"

Tugas: Update OpenAPI specification di atas sesuai permintaan user. Output HANYA YAML yang sudah diupdate, tanpa penjelasan. Mulai dengan "openapi: 3.0.0"`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();
            
            text = text.replace(/```yaml\n?/g, '').replace(/```\n?/g, '').trim();
            
            return text;
        } catch (error) {
            console.error('Error refining spec:', error);
            // Fallback: return current spec with a note
            return currentSpec + `\n\n# Note: AI refinement failed. Showing original spec.
# Requested change: ${refinementPrompt}
# Please configure a valid Gemini API key for AI-powered refinement.`;
        }
    }
}
