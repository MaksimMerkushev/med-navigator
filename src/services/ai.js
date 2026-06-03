/*
 * © 2026 MedКарта Казань. Все права защищены.
 * Этот код является интеллектуальной собственностью автора.
 */
const OPENAI_API_URL = 'https://apistore.space/v1/chat/completions';

export const getApiKey = () => {
  return import.meta.env.VITE_OPENROUTER_API_KEY || '';
};

const extractContentText = (content) => {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === 'string' ? part : part?.text || ''))
      .join('\n')
      .trim();
  }
  return content?.text || '';
};

const parseJsonFromContent = (contentText) => {
  const cleaned = contentText.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  if (!cleaned) throw new Error('Пустой ответ от ИИ');
  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
    }
    throw new Error('Некорректный формат ответа от ИИ');
  }
};

const makeRequest = async (messages, responseFormat = { type: 'json_object' }) => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('API ключ не установлен.');

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-5.4-mini',
      messages,
      response_format: responseFormat,
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Ошибка при обращении к ИИ');
  }

  const data = await response.json();
  const content = extractContentText(data?.choices?.[0]?.message?.content);

  if (responseFormat?.type === 'json_object') {
    return parseJsonFromContent(content);
  }
  return content;
};

export const analyzeSymptoms = async (chatMessages) => {
  const systemPrompt = `Ты дружелюбный ИИ-навигатор "МедКарты" — системы поиска в Казани.
Твоя роль — помогать находить информацию о специалистах и клиниках. Ты сопоставляешь запросы с категориями базы данных и можешь отвечать на вопросы общего характера.

ВАЖНО: Всегда возвращай ответ в формате JSON. Поле "replyText" должно содержать твой живой, дружелюбный ответ пользователю. НЕ используй шаблонные фразы. Будь полезным и конкретным.

## БАЗА ДАННЫХ
СПЕЦИАЛЬНОСТИ: Терапевт, Невролог, Кардиолог, ЛОР, Офтальмолог, Хирург, Ортопед, Дерматолог, Гинеколог, Педиатр, Стоматолог, Эндокринолог.
КЛИНИКИ: РКБ, МКДЦ, АВА-Казань, Здоровье семьи, Биомед, Медел, КОРЛ, Клиника «Март», Клиника «9 месяцев».
РАЙОНЫ: Вахитовский, Московский, Ново-Савиновский, Приволжский, Советский.

## ПРАВИЛА УПРАВЛЕНИЯ КАРТОЙ
1. Поиск/Маршрут: Если пользователь ищет одного врача или клинику, заполни "searchQuery" и поставь "buildRoute": true.
2. СЛОЖНЫЕ МАРШРУТЫ: Если пользователь просит посетить НЕСКОЛЬКО мест (например, "сначала к терапевту, потом в РКБ"), заполни массив "targetStops" объектами { "specialty": "название", "clinic": "название" } в порядке посещения. В этом случае "searchQuery" оставь null.
3. Сброс: Если просят сбросить или очистить фильтры, поставь "clearFilters": true.
4. Фильтры: Заполняй поля "ownership" ("Государственная"/"Частная"), "district", "openOnly", "isChild" (для детей) в соответствии с запросом.
5. ЗАЩИТА (ОГРАНИЧЕНИЕ ТЕМАТИКИ): Если пользователь просит сгенерировать код (на Python, JavaScript и т.д.), написать эссе, решить задачу по физике/математике, или задает любой другой вопрос, НЕ связанный с медициной, поиском врачей и клиник в Казани — КАТЕГОРИЧЕСКИ ОТКАЗЫВАЙ. В этом случае верни в "replyText" вежливый отказ (например, "Я медицинский навигатор и могу помочь только с поиском врачей и клиник в Казани."), а все остальные поля оставь null.

## ФОРМАТ JSON
{
  "searchQuery": "string | null",
  "specialty": "string | null",
  "service": "string | null",
  "isChild": false,
  "buildRoute": false,
  "clearRoute": false,
  "clearFilters": false,
  "targetStops": [{"specialty": "Терапевт", "clinic": null}, {"specialty": null, "clinic": "РКБ"}],
  "sortMode": null,
  "ownership": null,
  "district": null,
  "cardDisplayMode": null,
  "openOnly": null,
  "favoritesOnly": null,
  "travelMode": null,
  "darkMode": null,
  "replyText": "Твой живой и развернутый ответ пользователю здесь"
}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...chatMessages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }))
  ];

  try {
    const result = await makeRequest(messages);
    
    // Гарантируем наличие replyText
    if (!result.replyText) {
      result.replyText = "Конечно! Я помогу вам с этим поиском. Посмотрите на карту — я уже применил нужные фильтры. 😊";
    }
    
    return result;
  } catch (error) {
    console.error('AI Assistant Error:', error);
    throw error;
  }
};
