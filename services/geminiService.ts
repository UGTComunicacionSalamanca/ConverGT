import { GoogleGenAI } from "@google/genai";
import { Activity } from '../types';

if (!process.env.API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this context, we assume the key is present.
  console.warn("API_KEY environment variable not set. Gemini features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || " " });

const callGemini = async (prompt: string): Promise<string> => {
    if (!process.env.API_KEY) {
        return Promise.resolve("Error: La clave de API de Gemini no está configurada. La función de análisis no está disponible.");
    }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            return `Error al contactar el servicio de IA: ${error.message}. Asegúrate de que la clave de API sea válida.`;
        }
        return "Ocurrió un error desconocido al contactar con la IA.";
    }
};


export const analyzeActivitiesForPress = async (activities: Activity[]): Promise<string> => {
  if (activities.length === 0) {
    return "No hay actividades para analizar. Registre algunas primero.";
  }

  const formattedActivities = activities.map(act => 
    `- Título: ${act.title}\n` +
    `  Secretaría Responsable: ${act.secretaria}\n` +
    `  Categoría: ${act.category}\n` +
    `  Descripción: ${act.description}\n` +
    `  Etiquetas de Relevancia: ${act.relevanceTags.join(', ')}\n` +
    `  Observaciones: ${act.observations}`
  ).join('\n\n');

  const prompt = `
    Eres un experto en comunicación estratégica y relaciones públicas para una organización sindical. Tu misión es identificar oportunidades noticiosas en las actividades internas para proyectar una imagen pública fuerte y coherente.

    Analiza la siguiente lista de actividades registradas por diferentes secretarías del sindicato. Identifica las 2-3 actividades con mayor potencial para convertirse en una nota de prensa o una comunicación externa exitosa.

    Para cada oportunidad que identifiques, proporciona:
    1.  **Titular Sugerido:** Un titular atractivo y conciso para la prensa.
    2.  **Ángulo de la Noticia:** Una breve explicación de por qué es noticiable y cuál debería ser el enfoque principal (considerando la secretaría implicada).
    3.  **Público Objetivo:** A qué tipo de medios o audiencias se debería dirigir.

    Sé claro, directo y estratégico en tus recomendaciones. Formatea tu respuesta de manera legible.

    Aquí están las actividades:
    ---
    ${formattedActivities}
    ---
  `;

    return callGemini(prompt);
};

export const generateSocialMediaPost = async (activity: Activity | null, platform: string, additionalContext: string): Promise<string> => {
    const platformInstructions = {
        Twitter: "Sé conciso (menos de 280 caracteres), directo y usa 2-3 hashtags relevantes.",
        Facebook: "Escribe un texto un poco más largo y emotivo, que invite a la discusión. Termina con una pregunta. Utiliza emojis para mejorar la legibilidad.",
        Instagram: "El foco es visual. Escribe un pie de foto atractivo y sugiere una idea para la imagen o vídeo. Usa 5-7 hashtags populares y relevantes.",
        TikTok: "Escribe un guion corto y dinámico para un vídeo de 15-30 segundos. Incluye acciones visuales, texto en pantalla y sugiere una canción en tendencia.",
        'WhatsApp/Telegram': "Redacta un mensaje claro y directo para ser difundido en grupos. Debe ser fácil de leer y reenviar. Incluye un llamado a la acción claro y emojis."
    };

    const instruction = platformInstructions[platform as keyof typeof platformInstructions] || "Crea una publicación genérica para redes sociales.";

    const prompt = `
        Eres un community manager experto para un sindicato. Tu objetivo es crear una publicación para ${platform} basada en la información proporcionada.

        **Instrucciones específicas para ${platform}:**
        ${instruction}

        ---
        **Información Base para la Publicación:**
        
        ${activity ? `
        **Actividad Registrada:**
        - **Título:** ${activity.title}
        - **Secretaría Responsable:** ${activity.secretaria}
        - **Descripción:** ${activity.description}
        - **Observaciones/Resultados:** ${activity.observations}
        - **Etiquetas Clave:** ${activity.relevanceTags.join(', ')}
        ` : ''}

        ${additionalContext ? `
        **Contexto o Enlace Adicional (priorizar esta información si existe):**
        ${additionalContext}
        ` : ''}
        ---

        Usa la actividad y/o el contexto adicional para generar únicamente el texto para la publicación de ${platform}. Si se proporciona un enlace, puedes mencionarlo o usar la información de la página enlazada para crear el post. No añadas introducciones ni comentarios adicionales.
    `;

    return callGemini(prompt);
};